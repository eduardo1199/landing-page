import './style.css';
import {Postprops} from '../../types/Postprops';


export default function Pots({url, title, body}: Postprops){
   return(
    <div className="post">
      <img src={url} alt={title} />
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
   )
}