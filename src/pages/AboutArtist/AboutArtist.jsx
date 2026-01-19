import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaPause, FaPlay } from "react-icons/fa";
import Style from "./AboutArtist.module.css";

const AboutArtist = () => {
  const location = useLocation();
  const { idArtista } = location.state;

  const [data, setData] = useState([]); // Dados dos álbuns
  const [dataTracklist, setDataTracklist] = useState([]); // Dados da tracklist
  const [id, setId] = useState(""); // ID do álbum selecionado
  const [currentIndex, setCurrentIndex] = useState(0); // Índice atual do carrossel
  const [isPlaying, setIsPlaying] = useState(false); // Estado para controle do áudio
  const audioRef = useRef(null); // Ref para o elemento de áudio
  const [currentTrack, setCurrentTrack] = useState(null); // Track atual

  // Função para buscar os álbuns do artista
  const getDataArtist = async () => {
    const response = await axios.get(`http://localhost:3000/api/artista`, {
      params: { idArtista },
    });
    const albums = response.data.data;
    setData(albums);

    // Se os dados existirem, já fazer a requisição do 1º álbum
    if (albums.length > 0) {
      setId(albums[0].id); // Define o primeiro álbum como selecionado
    }
  };

  // Função para buscar a tracklist do álbum selecionado
  const getDataTrackList = async (albumId) => {
    const response = await axios.get(`http://localhost:3000/tracklist`, {
      params: { idArtista: albumId },
    });
    setDataTracklist(response.data.data);
  };

  // Carrega os álbuns quando o componente é montado
  useEffect(() => {
    getDataArtist();
  }, []);

  // Carrega a tracklist quando o ID de um álbum é alterado
  useEffect(() => {
    if (id) {
      getDataTrackList(id);
    }
  }, [id]);

  // Atualiza o índice ao clicar em uma imagem
  const handleItemClick = (direction) => {
    const newIndex = (currentIndex + direction + data.length) % data.length;
    setCurrentIndex(newIndex);
    setId(data[newIndex].id); // Atualiza o ID do álbum
  };

  // Função para lidar com a mudança da faixa
  const handleTrackChange = (track) => {
    if (currentTrack && currentTrack === track.preview) {
      if (audioRef.current) {
        if (audioRef.current.paused) {
          audioRef.current.play();
          setIsPlaying(true);
        } else {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      setCurrentTrack(track.preview);
      audioRef.current = new Audio(track.preview);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // UseEffect para tocar a nova faixa se currentTrack mudar
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentTrack]);

  // Função de limpeza para parar o áudio ao sair da página
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setIsPlaying(false);
      }
    };
  }, []); // O array vazio [] garante que isso ocorra quando o componente desmontar

  return (
    <div>
      <NavLink to="/" className={Style.buttonBack}>
        <button>Voltar</button>
      </NavLink>

      <div className={Style.carousel}>
        {data.length > 0 && (
          <>
            {/* Imagem à esquerda */}
            <div
              className={Style.carousel_item}
              onClick={() => handleItemClick(-1)}
            >
              <img
                src={
                  data[(currentIndex - 1 + data.length) % data.length].cover_big
                }
                alt=""
                width="150px"
              />
            </div>

            {/* Imagem central */}
            <div className={Style.carousel_item}>
              <img src={data[currentIndex].cover_big} alt="" width="150px" />
              <h3>{data[currentIndex].title}</h3>
            </div>

            {/* Imagem à direita */}
            <div
              className={Style.carousel_item}
              onClick={() => handleItemClick(1)}
            >
              <img
                src={data[(currentIndex + 1) % data.length].cover_big}
                alt=""
                width="150px"
              />
            </div>
          </>
        )}
      </div>

      <h1 className={Style.titlePrev}>Previews</h1>

      <div className={Style.trackList}>
        {dataTracklist.map((track) => (
          <div
            key={track.id}
            className={`${Style.trackItem} ${
              currentTrack === track.preview ? Style.active : ""
            }`}
            onClick={() => handleTrackChange(track)}
          >
            <img
              src={data[currentIndex].cover_big}
              alt={track.title}
              className={Style.trackImage}
            />

            <div className={Style.trackInfo}>
              <span className={Style.trackTitle}>{track.title}</span>
              <span className={Style.trackArtist}>
                {track.artist?.name || "Artista desconhecido"}
              </span>
            </div>

            <div className={Style.iconContainer}>
              {currentTrack === track.preview && isPlaying ? (
                <FaPause size={14} />
              ) : (
                <FaPlay size={14} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutArtist;
