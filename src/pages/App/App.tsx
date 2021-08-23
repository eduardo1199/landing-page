import { useEffect, useState } from "react";
import './app.css';
import { Postprops } from '../../types/Postprops';
import Posts from '../../components/posts/Posts';
import Button from '@material-ui/core/Button';


function App() {

  const [posts, setPosts] = useState<Array<Postprops>>([]);
  const [homePage, setHomePage] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>(5);
  const [totalPage, setTotalPage] = useState<number>(0);
  /* const [disableNext, setDisableNext] = useState<boolean>(false);
  const [previousDisable, setPreviousDisable] = useState<boolean>(true);
 */
  const nextPage = () => {
    if(homePage >= totalPage - lastPage){
      return;
    }
    setHomePage(prev => prev + lastPage);
    setLastPage(prev => prev + lastPage);
  }

  const previousPage = () => {
    if(homePage < 5){
      return;
    }
    setHomePage(prev => prev - 5);
    setLastPage(prev => prev - 5);
   
  }


  useEffect(() => {
    const postLoading  = async () => {
      const postsRespose = fetch("https://jsonplaceholder.typicode.com/posts");
      const imagsPostReponse = fetch("https://jsonplaceholder.typicode.com/photos");
  
      const [posts] = await Promise.all([postsRespose]);
      const [imgsPost] = await Promise.all([imagsPostReponse]);
  
      const photosJson = await imgsPost.json();
      const postJson = await posts.json();
  
      const postAndPhotos: Array<Postprops> = postJson.map((post: Postprops,index: number) => {
         return {...post, url: photosJson[index].url};
      })

      setTotalPage(postAndPhotos.length);
      setPosts(postAndPhotos.slice(homePage, lastPage));
    }
    postLoading();
  }, [homePage, lastPage]);

  return (
    <div>
      <div className="container-post">
        {posts.map((post: Postprops, index: number) => {
          return(
            <Posts 
              key={index}
              id={post.id}
              url={post.url}
              body={post.body}
              title={post.title}
            />
          )
        })}
      </div>
      <div className="container-buttons">
        <Button 
          variant="contained" 
          onClick={() => previousPage()} 
          disabled={homePage < 5 ? true : false}
        >
          Página anterior
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => nextPage()}
          disabled={homePage >= totalPage - lastPage ? true : false}
        >
          Próxima página
        </Button>
      </div>
   </div>
  );
}

export default App;
