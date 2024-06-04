import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { NotificationFollow, NotificationPost  } from '@/type/post';


export async function GET(request: NextRequest){
    console.log('GET /api/profile/notification/get');
    try {
        const client = await GetClient();
        const cursor = request.nextUrl.searchParams.get("cursor")
        const userid = request.nextUrl.searchParams.get("userid")
        if (userid === undefined || userid === null) {
            return NextResponse.json({ error: 'Missing "userid" parameter' }, { status: 500 });
        }

        if (cursor === undefined || cursor === null) {
            return NextResponse.json({ error: 'Missing "cursor" parameter' }, { status: 500 });
        }

        const cursorValue = parseInt(cursor as string) || 0;
        const pageSize = 7;
        const pageParam = cursorValue * pageSize;

        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const result = await client.query(
            `SELECT
                CASE
                    WHEN n.PostId IS NOT NULL THEN u.Userid
                    ELSE (SELECT u.Userid from user u where  u.Userid = n.Userid )
                END Userid,
                CASE
                    WHEN n.PostId IS NOT NULL THEN u.Name
                    ELSE (SELECT u.Name from user u where  u.Userid = n.Userid )
                END Name,
                CASE
                    WHEN n.PostId IS NOT NULL THEN u.Username
                    ELSE (SELECT u.Username from user u where  u.Userid = n.Userid )
                END Username,
                (SELECT u.Username from user u where  u.Userid = n.Userid ) as Actor,
                CASE
                    WHEN n.PostId IS NOT NULL THEN u.ProfilePicture
                    ELSE (SELECT u.ProfilePicture from user u where  u.Userid = n.Userid )
                END ProfilePicture,
                n.NotificationId,
                n.PostId,
                p.Content,
                n.Type,
                n.Seen,
                n.DestinationId,
                CASE 
                    WHEN n.PostId IS NOT NULL THEN (SELECT COUNT(*) FROM Post AS c WHERE c.ParentPostId = p.PostId)
                    ELSE NULL
                END AS cantidad_respuestas,
                CASE 
                    WHEN n.PostId IS NOT NULL THEN (SELECT COUNT(*) FROM Likes AS l WHERE l.PostId = p.PostId)
                    ELSE NULL
                END AS cantidad_likes,
                CASE 
                    WHEN n.PostId IS NOT NULL THEN (SELECT COUNT(*) FROM Saved AS sv WHERE sv.PostId = p.PostId)
                    ELSE NULL
                END AS cantidad_saved,
                CASE 
                    WHEN n.PostId IS NOT NULL THEN (SELECT COUNT(*) FROM Share AS s WHERE s.PostId = p.PostId)
                    ELSE NULL
                END AS cantidad_share,
                CASE 
                    WHEN n.PostId IS NOT NULL THEN GROUP_CONCAT(DISTINCT media.Url SEPARATOR ', ')
                    ELSE NULL
                END AS urls_images
            FROM 
                Notification n
            INNER JOIN 
                User ou ON n.DestinationId = ou.UserId
            LEFT JOIN
                Post p ON p.PostId = n.PostId
            LEFT JOIN
                User u on p.Userid = u.UserId
            LEFT JOIN 
                Media media ON p.PostId = media.PostId
            LEFT JOIN
                Follow f on f.UserId = ou.UserId
            WHERE 
                ou.UserId = ? AND n.DestinationId = ?
            GROUP BY 
                p.Content, u.UserID, Name, u.Username, u.ProfilePicture, n.NotificationId, n.PostId, n.Type, n.Seen, n.DestinationId, Actor
            ORDER BY 
                p.PostID DESC        
            LIMIT ? OFFSET ?
            `, [userid, userid, pageSize, pageParam]);
          
          // Procesar la respuesta
          const rawNotifications = result[0] as any[];
          
          const notifications: Array<NotificationPost | NotificationFollow> = rawNotifications.map((rawNotification: any) => {
              if (rawNotification.PostID !== null && rawNotification.Content !== null) {
                  return {
                      NotificationId: rawNotification.NotificationId,
                      UserId: rawNotification.UserID,
                      Type: rawNotification.Type,
                      Seen: rawNotification.Seen,
                      DestinationId: rawNotification.DestinationId,
                      PostID: rawNotification.PostID,
                      Content: rawNotification.Content,
                      
                      Name: rawNotification.Name,
                      Username: rawNotification.Username,
                      Actor: rawNotification.Actor,
                      ProfilePicture: rawNotification.ProfilePicture,
                      RepostBy: rawNotification.RepostBy,
                      cantidad_likes: rawNotification.cantidad_likes || 0,
                      cantidad_respuestas: rawNotification.cantidad_respuestas || 0,
                      cantidad_saved: rawNotification.cantidad_saved || 0,
                      cantidad_share: rawNotification.cantidad_share || 0,
                      urls_images: rawNotification.urls_images || ''
                  } as NotificationPost;
              } else {
                  return {
                      NotificationId: rawNotification.NotificationId,
                      UserId: rawNotification.UserID,
                      Username: rawNotification.Username,
                      Actor: rawNotification.Actor,
                      ProfilePicture: rawNotification.ProfilePicture,
                      Type: rawNotification.Type,
                      Seen: rawNotification.Seen,
                      DestinationId: rawNotification.DestinationId
                  } as NotificationFollow;
              }
          });
        const len = Object.keys(notifications);
        const ln: number = len.length;
        
        const nextId = ln < pageSize ? null : cursorValue + 1;
        const previousId = cursorValue > 0 ? cursorValue -1 : null;

        

        return NextResponse.json({ notifications, nextId, previousId }, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
