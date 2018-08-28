var express =require("express"),
     app    =express(),
 bodyParser =require("body-parser"),
 mongoose   =require("mongoose"),
 methodOverride=require("method-override"),
 expressSanitizer=require("express-sanitizer")

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method")); /// HTML dont support PUT and delete requrest, and we HAVE to follow Restful Routes
app.use(expressSanitizer());
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost/restful_blog_app");
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:
        {type:Date,default: Date.now}
});



var Blog=mongoose.model("Blog",blogSchema);

// start with index and it should list all the blogs
// Blog.create({
//     title:"Test",
//     image:"https://images.pexels.com/photos/1262972/pexels-photo-1262972.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
//     body:"How to write your own blog from scratch."
// });
//restfull routes
app.get("/",function(req,res){
    res.redirect("blogs");
});
app.get("/blogs",function(req,res)
{
//   
    Blog.find({},function(err,blogs)
    {
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });

});

app.get("/blogs/new",function(req,res)
{
    res.render("new");
})


// NEW ROUTE, create a form to add a post
app.get("/blogs/new",function(req,res)
{
    res.render("new"); // new ejs will be rendered 
});

app.post("/blogs",function(req,res){
    // console.log(req.body);
    req.body.blog.body=req.sanitize(req.body.blog.body);
    // console.log("================");
    // console.log(req.body);
    Blog.create(req.body.blog,function(err,newBlog)
    {
        if(err)
        {
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id",function(req,res)
{
    
   Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            //render show template with that campground
            res.render("show", {blog: foundBlog});
        }
    });
   
   
});
app.get("/blogs/:id/edit",function(req,res)
{
    Blog.findById(req.params.id,function(err,foundBlog)
    {
        if(err)
        {
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:foundBlog});
        }
    });
   
});

app.put("/blogs/:id",function(req,res)
{
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog)
    {
        if(err)
        {
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
 
    
});
app.delete("/blogs/:id",function(req,res)
{
   
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});
app.listen(process.env.PORT,process.env.IP,function()
{
    console.log("The Server has started!");
});
