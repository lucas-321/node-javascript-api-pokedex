const pokemonId = new URLSearchParams(window.location.search).get('id');
const pokeData = document.getElementById('pokeData')

const infoList = document.getElementById('infoList')
const about = document.getElementById('about')
const base_stats = document.getElementById('base_stats')
const evolution = document.getElementById('evolution')
const moves = document.getElementById('moves')

// informações detalhadas de cada pokemon

function convertPokeApiDetailToPokemon3(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    pokemon.types = types
    pokemon.type = type

    pokemon.height = pokeDetail.height
    pokemon.weight = pokeDetail.weight
    
    const abilities = pokeDetail.abilities.map((ability) => ability.ability.name)
    pokemon.abilities = abilities

    const moves = pokeDetail.moves.map((move) => move.move.name)
    pokemon.moves = moves

    pokemon.hp = pokeDetail.stats[0].base_stat
    pokemon.attack = pokeDetail.stats[1].base_stat
    pokemon.defense = pokeDetail.stats[2].base_stat
    pokemon.spAttack = pokeDetail.stats[3].base_stat
    pokemon.spDefense = pokeDetail.stats[4].base_stat
    pokemon.speed = pokeDetail.stats[5].base_stat
    
    const totalStats = pokeDetail.stats.reduce((acc, stat) => acc + stat.base_stat, 0)
    pokemon.totalStats = totalStats

    return pokemon
}

function convertPokeApiDetailToPokemon2(pokeDetail) {
    const pokemon = new Pokemon()
    
    const eggGroups = pokeDetail.egg_groups.map((eggGroup) => eggGroup.name);
    pokemon.eggGroups = eggGroups;

    return pokemon
}

function getPokemonDetails(pokemonId) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    return fetch(url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon3)
        .catch((error) => console.error(error));
}

//Essa aqui trará os dados de egg group que não estão presentes na outra api
function getPokemonDetails2(pokemonId) {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    return fetch(url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon2)
        .catch((error) => console.error(error));
}
//Fim da adição do Egg Group

//dados do topo

function loadPokemonDetails(pokemonId) {
    getPokemonDetails(pokemonId).then((pokemon) => {
      const topHtml = `
        <div class="superior">
            <div class="top">
              <a href='index.html'><i class="material-icons">arrow_back</i></a>
              <i class="material-icons">favorite_border</i>
            </div>
            <div id="mainData" class="detail-top-data">
              <h1>${pokemon.name}</h1>
              <h2>#${pokemon.number.toString().padStart(3, '0')}</h2>
            </div>
            <div class="types2">
              ${pokemon.types.map((type) => `<h4 class="types3 ${type}">${type}</h4>`).join('')}
            </div>
          <div class="detail-img">
            <div>
              <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
          </div>
        </div>
      `;
      pokeData.innerHTML = topHtml

      const body = document.querySelector('body');
      body.classList.add(`${pokemon.type}`)

    });
}

loadPokemonDetails(pokemonId);

// fim do informações detalhadas de cada pokemon

//fim dos dados do topo

var html = '';

function loadPokemonAbout(pokemonId) {

getPokemonDetails(pokemonId).then((pokemon) => {

    html = ` 
        <table class="info">
        <tr>
            <th>Species</th>
            <td>${pokemon.name}</td>
        </tr>
        <tr>
            <th>Height</th>
            <td>${parseFloat((pokemon.height*10).toFixed(2))} cm</td>
        </tr>
        <tr>
            <th>Weight</th>
            <td>${parseFloat((pokemon.weight*.1).toFixed(2))} kg</td>
        </tr>
        <tr>
            <th>Abilities</th>
            <td>${pokemon.abilities.map((ability) => `${ability}`).join(", ")}</td>
        </tr>
        </table>
    `;

    return getPokemonDetails2(pokemonId);
    })
    .then((pokemon) => {
    html += `
        <tr>
        <th>Breeding</th>
        </tr>
        <table class="breeding">
        <tr>
            <th>Gender</th>
            <td class="gender"><span class="male">♂</span> 50% <span class="female">♀</span>50%</td>
        </tr>
        <tr>
            <th>Egg Groups</th>
            <td>${pokemon.eggGroups.map((eggGroup) => `${eggGroup}`).join(", ")}</td>
        </tr>
        <tr>
            <th>Egg Cycle</th>
            <td>${pokemon.eggGroups.map((eggGroup) => `${eggGroup}`).join(", ")}</td>
        </tr>
        </table>
    `;

    infoList.innerHTML = html;

    })
    .catch((error) => {
    console.error(error);
    });

}
  
about.addEventListener('click', function() {
  loadPokemonAbout(pokemonId);
});

loadPokemonAbout(pokemonId);

//Base Stats
//pegar forças e fraquezas do pokemon por tipo
async function getTypeDetails2(typeName) {
    const url = `https://pokeapi.co/api/v2/type/${typeName}`;
    return fetch(url)
        .then((response) => response.json())
        .then((data) => {

        let effectiveness = ``

        const { double_damage_to, double_damage_from, half_damage_to, half_damage_from, no_damage_to, no_damage_from } = data.damage_relations;

        effectiveness = `
        <table class="info">
            <tbody>
                <tr>
                    <th>Double Damage To</th>
                    <td class='types2'>
                        ${double_damage_to.map((type) => `<h4 class="types3 ${type.name}">${type.name}</h4>`).join(" ")}
                    </td>
                </tr>
                <tr>
                    <th>Double Damage From</th>
                    <td class='types2'>
                        ${double_damage_from.map((type) => `<h4 class="types3 ${type.name}">${type.name}</h4>`).join(" ")}
                    </td>
                </tr>
                <tr>
                    <th>Half Damage To</th>
                    <td class='types2'>
                        ${half_damage_to.map((type) => `<h4 class="types3 ${type.name}">${type.name}</h4>`).join(" ")}
                    </td>
                </tr>
                <tr>
                    <th>Half Damage From</th>
                    <td class='types2'>
                        ${half_damage_from.map((type) => `<h4 class="types3 ${type.name}">${type.name}</h4>`).join(" ")}
                    </td>
                </tr>
                <tr>
                    <th>No Damage To</th>
                    <td class='types2'>
                        ${no_damage_to.map((type) => `<h4 class="types3 ${type.name}">${type.name}</h4>`).join(" ")}
                    </td>
                </tr>
                <tr>
                    <th>No Damage From</th>
                    <td class='types2'>
                        ${no_damage_from.map((type) => `<h4 class="types3 ${type.name}">${type.name}</h4>`).join(" ")}
                    </td>
                </tr>
            </tbody>
        </table>
        `
        return effectiveness
    })
    .catch((error) => console.error(error));
}
//fim

// carregar status dos pokemons
async function loadPokemonBaseStats(pokemonId) {
    var baseStatsHtml;
  
    getPokemonDetails(pokemonId).then(async (pokemon) => {
    var name = pokemon.name
    var type = pokemon.type

    baseStatsHtml = ` 
    <table id="stats" class="stats">
        <tr>
            <th>HP</th>
            <td>${pokemon.hp}</td>
            <td class="bar">
            <div class="progress">
                <div class="progress-bar" data-percent="${pokemon.hp}%"></div>
            </div>
            </td>
        </tr>
        <tr>
            <th>Attack</th>
            <td>${pokemon.attack}</td>
            <td class="bar">
            <div class="progress">
                <div class="progress-bar" data-percent="${pokemon.attack}%"></div>
            </div>
            </td>
        </tr>
        <tr>
            <th>Defense</th>
            <td>${pokemon.defense}</td>
            <td class="bar">
            <div class="progress">
                <div class="progress-bar" data-percent="${pokemon.defense}%"></div>
            </div>
            </td>
        </tr>
        <tr>
            <th>Sp. Atk</th>
            <td>${pokemon.spAttack}</td>
            <td class="bar">
            <div class="progress">
                <div class="progress-bar" data-percent="${pokemon.spAttack}%"></div>
            </div>
            </td>
        </tr>
        <tr>
            <th>Sp. Def</th>
            <td>${pokemon.spDefense}</td>
            <td class="bar">
            <div class="progress">
                <div class="progress-bar" data-percent="${pokemon.spDefense}%"></div>
            </div>
            </td>
        </tr>
        <tr>
            <th>Speed</th>
            <td>${pokemon.speed}</td>
            <td class="bar">
            <div class="progress">
                <div class="progress-bar" data-percent="45%"></div>
            </div>
            </td>
        </tr>
        <tr>
            <th>Total</th>
            <td>${pokemon.totalStats}</td>
            <td class="bar">
            <div class="progress">
                <div class="progress-bar" data-percent="52%"></div>
            </div>
            </td>
        </tr>
    </table>
    <h4>Type Defenses</h4>
    <h4>
        The effectiveness of each type on <span style='text-transform: capitalize;'>${name}</span>
    </h4>`;

    baseStatsHtml += await getTypeDetails2(type);
    infoList.innerHTML = baseStatsHtml;

    loadStatus();

})

}

function loadStatus(){
    let bars = document.querySelectorAll(".progress-bar");

    bars.forEach((bar) => {
        const percent = bar.getAttribute("data-percent");
        bar.style.setProperty("--percent", percent);

        if (parseInt(percent) < 50) {
            bar.classList.add("red");
        }
    });
}

base_stats.addEventListener('click', function() {
    loadPokemonBaseStats(pokemonId);
});

//fim do carregamento de status dos pokemons

//Evoluções
function getEvolutionChain(pokemonId) {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    fetch(url)
      .then(response => response.json())
      .then(speciesData => {
        const evolutionChainUrl = speciesData.evolution_chain.url;
        fetch(evolutionChainUrl)
          .then(response => response.json())
          .then(evolutionChainData => {
            const chain = evolutionChainData.chain;
            const evolutionChain = [];
            parseEvolutionChain(chain, evolutionChain);
            displayEvolutionChain(evolutionChain);
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  }
  
  function parseEvolutionChain(chain, evolutionChain) {
    const species = {
      name: chain.species.name,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonIdFromURL(chain.species.url)}.png`
    };
    evolutionChain.push(species);
  
    if (chain.evolves_to.length > 0) {
      parseEvolutionChain(chain.evolves_to[0], evolutionChain);
    }
  }
  
  function displayEvolutionChain(evolutionChain) {
    if (evolutionChain.length > 0) {
      const table = document.createElement("table");
      const headerRow = document.createElement("tr");
      const nameHeader = document.createElement("th");
      const spriteHeader = document.createElement("th");
      headerRow.appendChild(nameHeader);
      headerRow.appendChild(spriteHeader);
      table.appendChild(headerRow);

      table.classList.add("info")
  
      evolutionChain.forEach(pokemon => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        nameCell.textContent = pokemon.name;
        const spriteCell = document.createElement("td");
        const spriteImg = document.createElement("img");
        spriteImg.src = pokemon.sprite;
        spriteCell.appendChild(spriteImg);
        row.appendChild(nameCell);
        row.appendChild(spriteCell);
        table.appendChild(row);
      });
  
      const evolutionContainer = document.getElementById("infoList");
      evolutionContainer.innerHTML = "";
      evolutionContainer.appendChild(table);
    } else {
      console.log("Esse pokemon não possui evoluções.");
    }
  }
  
  function getPokemonIdFromURL(url) {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 2];
  }
  
evolution.addEventListener('click', function() {
    getEvolutionChain(pokemonId);
});
//Fim de Evoluções

//Movimentos
var movesHtml = '';

function loadPokemonMoves(pokemonId) {

getPokemonDetails(pokemonId).then((pokemon) => {

    movesHtml = ` 
    <h4>Moves</h4>
    <table class="info">
      ${pokemon.moves.map((move, index) => `
        <tr>
          <th>Move ${index + 1}:</th>
          <td>${pokemon.moves[index]}</td>
        </tr>
      `).join('')}
    </table>
    `;

    infoList.innerHTML = movesHtml;
    return getPokemonDetails(pokemonId);

    })
    .catch((error) => {
        console.error(error);
    });

}
  
moves.addEventListener('click', function() {
  loadPokemonMoves(pokemonId);
});
//Fim de Movimentos

