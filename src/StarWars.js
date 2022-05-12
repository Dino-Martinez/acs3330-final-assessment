import React, { useEffect, useState } from 'react'

function* keyGen() {
    let index = 0
    while(true) {
        yield index++
    }
}

function StarWars() {
    const [id, setId] = useState('')
    const [error, setError] = useState(null)
    const [data, setData] = useState()
    const [characters, setCharacters] = useState([])
    const keys = keyGen()

    const getHomeworld = async url => {
        const res = await fetch(url)
        const json = await res.json()
        return json
    }

    const submit = async () => {
        const _id = parseInt(id)
        setError(null)
        if (_id === 17) return setError('17 is not a valid ID')
        if (_id < 0) return setError('IDs must be positive numbers')
        if (_id > 83) return setError('IDs must be less than 84')

        const res = await fetch(`https://swapi.dev/api/people/${id}`)
        const json = await res.json()
        const homeworld = await getHomeworld(json.homeworld)
        json.homeworld = homeworld.name
        const filmsRes = await Promise.all(json.films.map(film => fetch(film)))
        const filmsJson = await Promise.all(filmsRes.map(res => res.json()))
        json.films = filmsJson
        setData(json)
    }
    useEffect(() => {
        if (data)
            setCharacters(prev => [...prev, data])
    }, [data])

    return (
        <div className='container'>
            <h3>Star Wars Character List:</h3>
            {error && 
                <p>{error}</p>
            }
            <label htmlFor='id'>Character ID:</label>
            <input name='id' type='number' min='1' max='83' value={id} onChange={e=> setId(e.target.value)} placeholder='Enter ID'/>
            <button onClick={submit}>Save</button>
            <div className='characters'>
                {characters.length > 0 &&
                    characters.map(character => {
                        return (
                            <div key={keys.next().value} className='data-list'>
                                    <p>Name: <span>{character.name}</span></p>
                                    <p>Height: <span>{character.height}</span></p>
                                    <p>Mass: <span>{character.mass}</span></p>
                                    <p>Gender: <span>{character.gender}</span></p>
                                    <p>Hair Color: <span>{character.hair_color}</span></p>
                                    <p>Eye Color: <span>{character.eye_color}</span></p>
                                    <p>Birth Year: <span>{character.birth_year}</span></p>
                                    <p>Home World: <span>{character.homeworld}</span></p>
                                    <p>Appears in:</p>
                                    <ul>
                                        {character.films.map(film =>  <li key={keys.next().value}>{film.title}</li>)}
                                    </ul>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default StarWars