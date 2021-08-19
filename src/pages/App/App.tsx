import { useEffect, useState } from "react";
import './app.css';
import { Postprops } from '../../types/Postprops';
import Posts from '../../components/posts/Posts';

function App() {

  const [posts, setPosts] = useState<Array<Postprops>>([]);

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

    const postAndPhotos: Array<Postprops> = postJson.map((post: Postprops,index: number) => {
       return {...post, url: photosJson[index].url};
    })

    setPosts(postAndPhotos);
  }

  
  return (
    <div className="container-post">
      {posts.map((post: Postprops, index: number) => {
        return(
          <>
            <Posts 
              key={index}
              id={post.id}
              url={post.url}
              body={post.body}
              title={post.title}
            />
          </>
        )
      })}
    </div>
  );
}

export default App;
