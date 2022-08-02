class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
   /*  _apiKey = "apikey=23603f5c348fa24e263a8c78e39c0886"; */
   _apiKey = "apikey=d7fc0a24438f58e4ce2907053e0848fc";
   _baseOffset= 210;


    getResourse = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Coud not fetch ${url}, status: ${res.status}`);
        }
        
        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResourse(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformChatacter)
    }

    getCharacter = async (id) => {
        const res = await this.getResourse(`${this._apiBase}characters/${id}?&${this._apiKey}`);
        return this._transformChatacter(res.data.results[0]);
    }

    _transformChatacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : "There is no description for this character",
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        } 
    }

}

export default MarvelService;