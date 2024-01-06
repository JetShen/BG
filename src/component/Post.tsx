import '@/styles/post.css';

export default function Post() {

    return(
        <div className="PostObject">
          <div className="miniSection">
            <img src="" alt="cat.jpg" className="profileImg" />
            <div className='section'>
              <h5 className="name">Name</h5>
              <p className="username">@username</p>
            </div>
          </div>
          <div className="innerContent">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus voluptatem aut officia pariatur? Sint at iure, ex quisquam nam rem atque numquam in laudantium officia! Obcaecati similique exercitationem accusantium reiciendis.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus voluptatem aut officia pariatur? Sint at iure, ex quisquam nam rem atque numquam in laudantium officia! Obcaecati similique exercitationem accusantium reiciendis.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus voluptatem aut officia pariatur? Sint at iure, ex quisquam nam rem atque numquam in laudantium officia! Obcaecati similique exercitationem accusantium reiciendis.</p>
          </div>
        </div>
    );
}