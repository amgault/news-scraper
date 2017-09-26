var Note = require('../models/Note.js')
var Article = require('../models/Article.js')
var request = require("request")
var cheerio = require("cheerio")


module.exports = function(app, db){

    app.post('/scrape',function(req, res){
        console.log("in scrape")
        
        request("http://www.reuters.com/news/archive/technologyNews?view=page", function(error, response, html){
            var $ = cheerio.load(html);
            var elements = $(".news-headline-list").children();
            console.log(typeof elements);
            var articlesArr = Object.values(elements);
            var articles = 0, counter = 10;
            console.log(articlesArr.length);
            
            //console.log("cheerio"+elements.length)
            for(var i=0; i<10; i++){
                var title = $(articlesArr[i]).find(".story-content a h3").text().trim();
                console.log("title: " +title);
                var text = $(articlesArr[i]).find(".story-content p").text().trim();

                var item = {};
                item.title = $(articlesArr[i]).find(".story-content a h3").text().trim();
                item.link = $(articlesArr[i]).find(".story-content a").attr("href");
                item.excerpt = $(articlesArr[i]).find(".story-content p").text().trim();
                var newArticle = new Article(item);
                newArticle.save(function(err, data){
                    if(err){
                        console.log(err);
                        counter--;
                    }
                    else{
                        articles++;
                    }
                    if(articles===counter-1){
                        console.log("article", articles);
                        if(articles>0){
                            res.send(articles + "articles added");
                        }
                        else{
                            res.send("no new article");
                        }
                    }    
                })
            }
            
        })
    })

    app.get('/articles', function(req, res){

        Article.find({saved: false}, function(err, data){
            if(err){
                console.log(err)
            }
            else{
                res.json(data)
            }
        })
    })

    app.get('/saved', function(req, res){
        Article.find({saved: true}, function(err, data){
            if(err){
                console.log(err)
            }
            else{
                res.json(data)
            }
        })
    })

    app.post('/save/:id', function(req,res){
        Article.update({"_id":req.params.id}, {$set: {"saved": true}}, function(err, data){
            if(err){
                console.log(err)
            }
            else{
                res.redirect("/articles")
            }
        })
    })

    app.post('/delete/:id', function(req,res){
        Article.find({"_id":req.params.id}).remove(function(err, data){
            if(err){
                console.log(err)
            }
            else {
                res.redirect("/saved")
            }
            
        })
        
    })

}