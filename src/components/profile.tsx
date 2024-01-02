import PostContainer from '../components/post';


export default function Profile() {
  return (
    <div className="PfContainer">
      <div className="infoContainer">
        <div className="miniInfo">
          <img src="" alt="cat.jpg" className="profileImg" />
          <span >@Jetshen</span>
        </div>
      </div>
      <PostContainer/>
      <div className="followContainer"></div>
    </div>
  );
}