import { useEffect, useState } from "react";
import './app.css';
import { Postprops } from '../../types/Postprops';
import Posts from '../../components/posts/Posts';
import Button from '@material-ui/core/Button';
import { Input } from '@material-ui/core';


function App() {

  const [posts, setPosts] = useState<Array<Postprops>>([]);
  const [homePage, setHomePage] = useState<number>(0); 
  const [lastPage, setLastPage] = useState<number>(5);
  const [postPerPage, setPostPerPage] = useState<number>(5);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [seach, setSeach] = useState<string>('');

  const nextPage = () => {
    if(homePage >= totalPage - lastPage){
      return;
    }
    setHomePage(prev => prev + postPerPage);
    setLastPage(prev => prev + postPerPage);
    setPostPerPage(5);
  }

  const previousPage = () => {
    if(homePage < 5){
      return;
    }
    setHomePage(prev => prev - postPerPage);
    setLastPage(prev => prev - postPerPage);
    setPostPerPage(5);
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
      setPosts(!!seach ? postAndPhotos.filter((post: Postprops) => {
        return post.title.toLowerCase().includes(seach.toLowerCase());
      }) :postAndPhotos.slice(homePage, lastPage));
    }
    postLoading();
  }, [homePage, lastPage, seach]);

  return (
    <div>
      <div className="container-input">
        <span>Pesquisar por post: </span>
        <Input 
          color="primary" 
          placeholder="Search" 
          onChange={(e)=>setSeach(e.target.value)}
        />
      </div>
      <div className={!!seach ? `nonePost`: 'container-post'}>
       {posts.length === 0 ? (
          <h3>Não foi encontrado nenhum post com a título pesquisado</h3>
       ): (
         <>
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
        </>
       )}
      </div>
      <div className="container-buttons">
       {!seach && (
         <>
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
        </>
        )
      }
      </div>
   </div>
  );
}

export default App;
