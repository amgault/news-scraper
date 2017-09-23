var articles = $("#articles");
var saved = $("#saved-articles");

$("#scrape").on("click", function(){
    console.log("in scrape");
    $.post("/scrape")
    .done(function(data){
        console.log('post on scrape');
    });
});

$("#articles").on("click", "#save-article", function(){
    var id = $(this).attr("data-id");
    $.post("/save/"+id)
    .done(function(data){
        console.log('post articles');
    });
});

$("#saved-articles").on("click", "#delete-article", function(){
    var id = $(this).attr("data-id");
    console.log(id, "delete");
    $.post("/delete/"+id)
        .done(function(data){
            console.log('post saved articles');
        });
});

$("#saved").on("click", function(){
    $.getJSON("/saved", function(data){
        console.log('saved');
    });
});

$("#home").on("click", function(){
    console.log('home');
});
