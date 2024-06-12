
export type PostType = {
    PostId: number,
    Content: string,
    UserId: number,
    Name: string,
    Username: string,
    ProfilePicture: string,
    RepostBy: string,
    ParentPostUsername: string,
    cantidad_likes: number,
    cantidad_respuestas: number,
    cantidad_saved: number,
    cantidad_share: number,
    urls_images: string,
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
    Actor: String, // User Username Who sends the notification
    PostId: number,
    ProfilePicture: string,
    Type: string,
    Seen: boolean,
    DestinationId: number, // User Id Who receives the notification
};


export type NotificationFollow = {
    NotificationId: number,
    userid: number, // User Id Who sends the notification
    username: string,
    actor: String, // User Username Who sends the notification
    profilepicture: string,
    Type: string,
    Seen: boolean,
    DestinationId: number, // User Id Who receives the notification
}

export type NotificationPost = {
    NotificationId: number,
    userid: number, // User Id Who sends the notification
    Type: string,
    Seen: boolean,
    DestinationId: number, // User Id Who receives the notification
    PostId: number,
    Content: string,
    Name: string,
    username: string,
    actor: String, // User Username Who sends the notification
    profilepicture: string,
    cantidad_likes: number,
    cantidad_respuestas: number,
    cantidad_saved: number,
    cantidad_share: number,
    urls_images: string
}