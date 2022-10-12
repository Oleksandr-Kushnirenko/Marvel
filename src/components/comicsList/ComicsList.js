import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import Spinner from "../spinner/Spinner";
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from "../../services/MarvelService";
import "./comicsList.scss";

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);   // загрузка вызывается вручную (при клике на кнопку - вызове onRequest)
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);
    
    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {       // первый раз когда компонент отрендерился; компонент только создан на странице, первый раз отрендерился
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {  // повторный запрос по клику на кнопку; метод, который отвечает за запрос на сервер
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded);
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true
        }

        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
        setComicsEnded(comicsEnded => ended);
    }

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>    
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(comicsList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{"display" : comicsEnded ? "none" : "block"}}
                onClick={() => onRequest(offset)}>
                    <div className="inner">loan more</div>
            </button>
        </div>
    )
}

export default ComicsList; 