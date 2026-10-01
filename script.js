let allItems = [];
let currentType = "All";
let ads = [];

/*
==================================================
SMART CHOICE
MAIN WEBSITE SCRIPT
==================================================

Loads posts directly from JSONBin.

Blog posts open through:

/blog/article-name

Admin posting remains unchanged.
==================================================
*/


/* ==============================
   JSONBIN
============================== */

const BIN_ID = "6abc8c39ac6210605a041394";

/*
Paste the SAME JSONBin Master Key currently
used inside your admin.html here.
*/

const MASTER_KEY =   "$2a$10$3RW8/91mUub3ctcs1NQ7cOfZ.TiMNvJ.LmTqOso6.o5fLpcVKcGxu";


/* ==============================
   MENU
============================== */

function toggleMenu(){

    const nav = document.getElementById("nav");

    if(nav){
        nav.classList.toggle("active");
    }

}


/* ==============================
   SLUG
============================== */

function slugify(text){

    return String(text || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g,"-")
        .replace(/(^-|-$)/g,"");

}


/* ==============================
   LOAD POSTS
============================== */

async function load(){

    try{

        const response = await fetch(
  "https://api.jsonbin.io/v3/b/6abc8c39ac6210605a041394/latest",
  {
    headers: {
      "X-Master-Key": "$2a$10$KmhTU2fx0yVydXQZbpp0veLwavQi4UoLYlO68CkTjZQu1fy93z7ne"
    }
  }
);


        if(!response.ok){

            throw new Error(
                "JSONBin could not be reached. HTTP " +
                response.status
            );

        }


        const data = await response.json();
allItems = Array.isArray(data.record) ? data.record : [];

/* JSONBin v3 stores the actual data inside data.record */

let raw = data.record;

/* Make sure raw is an array. */

if(!Array.isArray(raw)){

            raw = [];

        }


        /*
        Remove test songs and ads from
        the normal post list.
        */

        allItems = raw.filter(function(item){

            return (
                item &&
                item.title &&
                item.title !== "Test Song" &&
                item.type !== "Ad"
            );

        });


        /*
        Keep advertisements separately.
        */

        ads = raw.filter(function(item){

            return (
                item &&
                item.type === "Ad"
            );

        });


        const loader =
            document.getElementById("loader");


        if(loader){

            loader.style.display = "none";

        }


        updateCount();

        renderAds();

        render(allItems);


    }catch(error){

        console.error(
            "Smart Choice loading error:",
            error
        );


        const loader =
            document.getElementById("loader");


        if(loader){

            loader.innerHTML = `

                <div class="empty">

                    <h3>
                        Posts could not be loaded.
                    </h3>

                    <p>
                        ${error.message}
                    </p>

                </div>

            `;

        }

    }

}


/* ==============================
   COUNT
============================== */

function updateCount(){

    const count =
        document.getElementById("count");


    if(!count){
        return;
    }


    if(!allItems.length){

        count.innerText = "";

        return;

    }


    function typeCount(type){

        return allItems.filter(function(item){

            return String(item.type || "")
                .toLowerCase()
                .includes(
                    type.toLowerCase()
                );

        }).length;

    }


    const products =
        allItems.filter(function(item){

            const type =
                String(item.type || "")
                    .toLowerCase();

            return [
                "product",
                "products",
                "affiliate"
            ].includes(type);

        }).length;


    count.innerText =
        `${allItems.length} items • ` +
        `Products: ${products} • ` +
        `Videos: ${typeCount("video")} • ` +
        `Music: ${typeCount("music")} • ` +
        `Apps: ${typeCount("app")}`;

}


/* ==============================
   ADS
============================== */

function renderAds(){

    const top =
        document.getElementById("ad-top");


    if(!top || !ads.length){
        return;
    }


    const ad =
        ads[ads.length - 1];


    top.innerHTML = `

        <a
            href="${ad.link || "#"}"
            target="_blank"
            rel="noopener noreferrer"
            style="
                display:flex;
                gap:10px;
                align-items:center;
                justify-content:center;
                text-decoration:none;
                color:inherit;
            "
        >

            ${
                ad.cover
                ?
                `<img
                    src="${ad.cover}"
                    style="
                        width:40px;
                        height:40px;
                        border-radius:8px;
                        object-fit:cover;
                    "
                >`
                :
                ""
            }

            <span>

                <b>
                    ${ad.title || "Sponsored"}
                </b>

                • ${ad.desc || "Sponsored"}

            </span>

        </a>

    `;

}


/* ==============================
   LOCAL LIKES
============================== */

function getLikes(){

    try{

        return JSON.parse(
            localStorage.getItem(
                "sc_likes"
            ) || "{}"
        );

    }catch(e){

        return {};

    }

}


function toggleLike(id,button){

    const likes =
        getLikes();


    if(likes[id]){

        alert(
            "You already liked this!"
        );

        return;

    }


    likes[id] = true;


    localStorage.setItem(
        "sc_likes",
        JSON.stringify(likes)
    );


    if(button){

        button.classList.add(
            "liked"
        );


        button.innerHTML =
            `<i class="fas fa-heart"></i> Liked`;

    }

}


/* ==============================
   RATINGS
============================== */

function getRatings(){

    try{

        return JSON.parse(
            localStorage.getItem(
                "sc_ratings"
            ) || "{}"
        );

    }catch(e){

        return {};

    }

}


function rateItem(
    id,
    stars,
    element
){

    const ratings =
        getRatings();


    if(ratings[id]){

        alert(
            "You already rated!"
        );

        return;

    }


    ratings[id] = stars;


    localStorage.setItem(
        "sc_ratings",
        JSON.stringify(ratings)
    );


    if(element){

        element.parentElement.innerHTML = `

            <span class="stars">

                ${"★".repeat(stars)}
                ${"☆".repeat(5-stars)}

            </span>

            Thanks!

        `;

    }

}


/* ==============================
   RENDER POSTS
============================== */

function render(items){

    const list =
        document.getElementById("list");


    if(!list){
        return;
    }


    const likes =
        getLikes();


    const ratings =
        getRatings();


    if(!items.length){

        list.innerHTML = `

            <div class="empty">

                No posts found.

            </div>

        `;

        return;

    }


    list.innerHTML =

        items
        .slice()
        .reverse()
        .map(function(item){

            const originalIndex =
                allItems.indexOf(item);


            const id =
                String(
                    (item.title || "post") +
                    "_" +
                    originalIndex
                )
                .replace(/'/g,"")
                .replace(/"/g,"");


            const liked =
                !!likes[id];


            const myRating =
                ratings[id];


            const type =
                item.type || "VIP";


            const typeLower =
                type.toLowerCase();


            const slug =
                slugify(item.title);


            let cover;


            if(item.cover){

                cover = `

                    <img
                        src="${item.cover}"
                        alt="${item.title || ""}"
                        onerror="
                            this.style.display='none'
                        "
                    >

                `;

            }else{

                let icon = "🛍️";


                if(typeLower === "music"){
                    icon = "🎵";
                }


                if(typeLower === "video"){
                    icon = "🎬";
                }


                if(typeLower === "app"){
                    icon = "📱";
                }


                if(typeLower === "picture"){
                    icon = "🖼️";
                }


                if(typeLower === "blog"){
                    icon = "📝";
                }


                cover = icon;

            }


            const description =
                String(
                    item.desc || ""
                ).substring(0,160);


            let buttons = "";


            /* BLOG */

            if(typeLower === "blog"){

                buttons += `

                    <a
                        class="btn btn-view blog-read"
                        href="/blog/${slug}"
                    >

                        Read

                    </a>

                `;

            }


            /* DOWNLOAD */

            if(item.download){

                let downloadText =
                    "Download";


                if(typeLower === "video"){
                    downloadText =
                        "Download Video";
                }


                if(typeLower === "music"){
                    downloadText =
                        "Download Music";
                }


                if(typeLower === "app"){
                    downloadText =
                        "Download App";
                }


                if(typeLower === "picture"){
                    downloadText =
                        "Download HD";
                }


                buttons += `

                    <a
                        class="btn btn-dl"
                        href="${item.download}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        <i class="fas fa-download"></i>

                        ${downloadText}

                    </a>

                `;

            }


            /* AFFILIATE */

            if(item.affiliate){

                buttons += `

                    <a
                        class="btn btn-buy"
                        href="${item.affiliate}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        🛒 Buy Now

                    </a>

                `;

            }


            /* LIKE */

            buttons += `

                <button
                    class="
                        like-btn
                        ${liked ? "liked" : ""}
                    "
                    onclick="
                        toggleLike(
                            '${id}',
                            this
                        )
                    "
                >

                    <i class="
                        ${liked ? "fas" : "far"}
                        fa-heart
                    "></i>

                    ${liked ? "Liked" : "Like"}

                </button>

            `;


            /* RATING */

            let ratingHTML = "";


            if(myRating){

                ratingHTML = `

                    <div class="stars">

                        ${"★".repeat(myRating)}
                        ${"☆".repeat(5-myRating)}

                        You

                    </div>

                `;

            }else{

                ratingHTML = `

                    <div
                        class="stars"
                        style="
                            cursor:pointer;
                            font-size:13px;
                        "
                    >

                        ${[1,2,3,4,5]
                            .map(function(star){

                                return `

                                    <span
                                        onclick="
                                            rateItem(
                                                '${id}',
                                                ${star},
                                                this
                                            )
                                        "
                                    >
                                        ☆
                                    </span>

                                `;

                            })
                            .join("")}

                    </div>

                `;

            }


            return `

                <div class="card">

                    <div class="cover">

                        ${cover}

                        <span
                            class="
                                badge
                                ${
                                    typeLower === "product"
                                    ? "vip"
                                    : ""
                                }
                            "
                        >

                            ${type.toUpperCase()}

                        </span>

                    </div>


                    <div class="info">

                        <h3>
                            ${item.title || "Untitled"}
                        </h3>


                        <div class="meta">

                            ${
                                item.artist
                                ? item.artist + " • "
                                : ""
                            }

                            ${item.date || ""}

                            ${
                                item.category
                                ? " • " + item.category
                                : ""
                            }

                        </div>


                        <div class="desc">

                            ${description}

                        </div>


                        ${
                            item.download
                            ?
                            `
                            <div class="file-info">

                                ${
                                    item.fileType ||
                                    "FILE"
                                }

                                ${
                                    item.fileSize
                                    ? " • " +
                                      item.fileSize
                                    : ""
                                }

                            </div>
                            `
                            :
                            ""
                        }


                        <div class="actions">

                            ${buttons}

                            ${ratingHTML}

                        </div>

                    </div>

                </div>

            `;

        })
        .join("");

}


/* ==============================
   SEARCH
============================== */

function doSearch(){

    const input =
        document.getElementById("search");


    const query =
        input
        ? input.value
            .toLowerCase()
            .trim()
        : "";


    let filtered;


    if(currentType === "All"){

        filtered =
            allItems.slice();

    }else{

        filtered =
            allItems.filter(function(item){

                return String(
                    item.type || ""
                )
                .toLowerCase()
                .includes(
                    currentType.toLowerCase()
                );

            });

    }


    if(query){

        filtered =
            filtered.filter(function(item){

                return (

                    String(
                        item.title || ""
                    )
                    .toLowerCase()
                    .includes(query)

                    ||

                    String(
                        item.artist || ""
                    )
                    .toLowerCase()
                    .includes(query)

                    ||

                    String(
                        item.desc || ""
                    )
                    .toLowerCase()
                    .includes(query)

                    ||

                    String(
                        item.category || ""
                    )
                    .toLowerCase()
                    .includes(query)

                );

            });

    }


    render(filtered);

}


/* ==============================
   FILTER
============================== */

function filterType(
    type,
    button
){

    currentType = type;


    document
        .querySelectorAll(".chip")
        .forEach(function(chip){

            chip.classList.remove(
                "active"
            );

        });


    if(button){

        button.classList.add(
            "active"
        );

    }


    doSearch();

}


/* ==============================
   START
============================== */

load();