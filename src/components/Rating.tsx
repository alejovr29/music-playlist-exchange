import type { Playlist, Song } from "@/types/music";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Rating = ({ playlist, song }: { playlist: Playlist; song: Song }) => {

    const router = useRouter();
    const playlistId = playlist.id;
    const songId = song.id;

    const [songRating, setSongRating] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Search and load rating for current song if existing.
    useEffect(() => {
        const fetchSongRatingData = async () => {
            try {
                const response = await fetch(`/api/playlists/${playlistId}/songs/${songId}/rating`);
                const data = await response.json();

                if (response.ok) {
                    setSongRating(data?.vote?.value)
                    console.log('El valor del fetching del song es:', data.vote.value)
                    console.log('El valor del songRating es:', songRating)
                } else {
                    console.log('No se encontró ningún registro')
                }
            }
            catch (error) {
                console.log(`Ocurrió un error al hacer fetching del rating de la canción: ${error}`)
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchSongRatingData();
    }, [song, router]);

    const handleRateSong = async (e: React.FormEvent) => {
        // Acá debo ver cómo asegurarme de que el valor de songRating es el deseado al momento de iniciar esta función de PUT.
        e.preventDefault();

        try {
            const response = await fetch(`/api/playlists/${playlistId}/songs/${songId}/rating`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ songRating }),
            });
        } catch (error) {
            console.log(`Ocurrió un error al intentar aplicar el rating de la canción: ${error}`)
        }
    }

    // Debo crear la función que se encargue de mostrar las estrellas del rating de acuerdo al valor existente de 1 a 5 si se recibió bien luego del GET, si no, mostrar las estrellas en vacío.

    // Hay que usar la canción actual y el usuario para poder asociar el valor en la BD.
    // Pero primero toca verificar si dicha canción ya ha sido calificada previamente por el usuario, así que asumo que toca hacer una llamada GET para obtener estos valores y en caso de que no existan mostrar la estructura base de las 5 estrellas para ser calificada la canción.
    // Una vez se califique la canción se hace la llamada POST para guardar estos valores en la DB.
    // Esto se debe hacer por cada canción, así que cuando se cambie de canción el useEffect debe asegurar dicha recuperación de los datos, pero quizá se pueda precargar las votaciones de todas las canciones en la carga inicial de la página para que sea más veloz la experiencia? o quizá sea mejor hacer la llamada por cada canción?...

    return (
        <div>
            <div style={{ display: 'flex', color: '#ffc107' }}>
                {[...Array(5)].map((_, index) => {
                    const starValue = index + 1;

                    // Estrellas llenas
                    if (songRating >= starValue) {
                        return <FaStar key={index} />;
                    }
                    // Estrellas a la mitad (ej. rating = 3.5)
                    else if (songRating >= starValue - 0.5) {
                        return <FaStarHalfAlt key={index} />;
                    }
                    // Estrellas vacías
                    else {
                        return <FaRegStar key={index} />;
                    }
                })}
            </div>

            {songRating && (
                <div className="" >
                    Hola
                </div>
            )}
        </div>
    )
}

export default Rating;