
export type PostType = {
    PostID: number,
    Content: string,
    UserID: number,
    Name: string,
    Username: string
    cantidad_likes: number,
    cantidad_respuestas: number,
    urls_images: string
};


export type TopicType = {
    TopicId: number,
    Name: string,
    Description: string,
    PostCount: number,
};