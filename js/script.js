const $list = document.querySelector('.list');
const $field = document.querySelector('.input-searcher');
const $count = document.querySelector('.count-container');


let list = null;   
let testList = null; 

if (getLS('list').length == 0)
{
    fetch('https://pokeapi.co/api/v2/pokemon')
        .then(function (responce)
        {
            return responce.json();
        })
        .then(function (data)
        {
            list = data.results;
            for (let i = 0; i < list.length; i++) {
                list[i].index = i;
            }
            listGenerator(list);
            setLS('list', list);
        })
}
else{
    listGenerator(getLS('list'));
}

function listGenerator(list)
{   
    console.log()
    let count = 0;
    let template = '';
    if (list.length){
        for (let i = 0; i < list.length; i++) {
            fetch(list[i].url)
            .then(function (responce)
            {
                return responce.json();
            })
            .then(function (data){
                template += '<div class="user"><div class="info"><div class="info-container"><div class="img-pok-container"><img src="'+ data.sprites.front_default +'" alt="#" class="img-pok"></div>'+
                    '<div class="container-name"><p class="name">'+ data.name +'</p></div>'+
                    '<div><p class="hp">HP: '+ data.stats[0].base_stat +'</p></div>'+
                    '<div><p class="attack">Attack: '+ data.stats[1].base_stat +'</p></div>'+
                    '<div><p class="defense">Defense: '+ data.stats[2].base_stat +'</p></div>'+
                    '<div><p class="speed">Speed: '+ data.stats[5].base_stat +'</p></div></div></div>'+
                    '<div class="container-btn"><input type="button" index="'+ list[i].index +'" value="Delete" class="btn"></div></div>'

                count++;
                $count.innerHTML = '<p class="count">'+ count +' pokemons</p>';
                $list.innerHTML = template;

            });
        }
    }
    else{
        template += '<div><h1 class"error">Not found</h1></div>';
    }
};


function setLS(key, value){
    localStorage.setItem(key, JSON.stringify(value));
}
function getLS(key) {
    return JSON.parse(localStorage.getItem(key));
}

$field.addEventListener('input', function() {
    list = getLS('list');
    let query = this.value.toLowerCase();
    let filterdList = list.filter(function (el) {
        return ~el.name.toLowerCase().indexOf(query);
    });

    listGenerator(filterdList);
})


$list.addEventListener('click', function(e) {
    if(e.target.classList.contains('btn')) {
        let templateList = getLS('list');
        console.log(templateList);
        let id = e.target.getAttribute('index');
        let id2 = templateList.findIndex(pokemon => pokemon.index == id);
        templateList.splice(id2, 1);
        console.log(templateList);
        setLS('list', templateList);
        $field.value = '';
        listGenerator(getLS('list'));
    }
})

