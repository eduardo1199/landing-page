import { useEffect, useState } from "react";
import './app.css';


type Posts = {
  id: number,
  title: string,
  body: string,
  url: string,
}


function App() {

  const [posts, setPosts] = useState<Array<Posts>>([]);

  useEffect(() => {
    postLoading();
  }, [])

  async function postLoading(){
    const postsRespose = fetch("https://jsonplaceholder.typicode.com/posts");
    const imagsPostReponse = fetch("https://jsonplaceholder.typicode.com/photos");

    const [posts] = await Promise.all([postsRespose]);
    const [imgsPost] = await Promise.all([imagsPostReponse]);

    const photosJson = await imgsPost.json();
    const postJson = await posts.json();

    const postAndPhotos: Array<Posts> = postJson.map((post: Posts,index: number) => {
       return {...post, url: photosJson[index].url};
    })

    setPosts(postAndPhotos);
  }

  
  return (
    <div className="container-post">
      {posts.map((post: Posts, index: number) => {
        return(
          <>
            <div className="post">
              <img src={post.url} alt={post.title} />
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </div>
          </>
        )
      })}
    </div>
  );
}

export default App;
