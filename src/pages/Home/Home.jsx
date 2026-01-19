import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Style from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [dadosArtista, setDadosArtista] = useState(null);
  const [idArtista, setIdArtista] = useState("");

  const handleSubmitRegistro = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/busca", { name });
      const artist = response.data.data[0];

      setDadosArtista(artist);
      setIdArtista(artist.id);
    } catch (error) {
      console.log(error);
    }
  };

  const clearAll = () => {
    setDadosArtista(null);
    setName("");
    setIdArtista("");
  };

  const aboutArtistNavigate = () => {
    navigate("/aboutArtist", { state: { idArtista } });
  };

  return (
    <div className={Style.page}>
      <div className={Style.card}>
        <h1 className={Style.title}>Descubra seu artista</h1>
        <p className={Style.subtitle}>
          Busque artistas e escute previews das músicas
        </p>

        <form onSubmit={handleSubmitRegistro} className={Style.form}>
          <input
            type="text"
            name="name"
            placeholder="Digite o nome do artista"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            required
          />
          <button type="submit">Buscar</button>
        </form>

        {dadosArtista && (
          <div className={Style.artistCard}>
            <img src={dadosArtista.picture_big} alt={dadosArtista.name} className={Style.artistImage} />
            <h2>{dadosArtista.name}</h2>
            <h5>Esse é o artista que você procura?</h5>

            <div className={Style.actions}>
              <button className={Style.confirm} onClick={aboutArtistNavigate}>
                Sim
              </button>
              <button className={Style.cancel} onClick={clearAll}>
                Não
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
