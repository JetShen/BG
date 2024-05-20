
export type PostType = {
    PostID: number,
    Content: string,
    UserID: number,
    Name: string,
    Username: string,
    ProfilePicture: string,
    RepostBy: string,
    cantidad_likes: number,
    cantidad_respuestas: number,
    cantidad_saved: number,
    cantidad_share: number,
    urls_images: string
};


export type TopicType = {
    TopicId: number,
    Name: string,
    Description: string,
    PostCount: number,
};

export type UserType = {
    UserId: number,
    Name: string,
    Username: string,
    Private: number,
    ProfilePicture: string,
    Followers: number,
    Following: number,
    FollowedBy: number,
};

export type NotificationType = {
    NotificationId: number,
    UserId: number, // User Id Who sends the notification
    Username: string,
    PostId: number,
    ProfilePicture: string,
    Type: string,
    Seen: boolean,
    DestinationId: number, // User Id Who receives the notification
};
