const express = require("express");

const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
app.use(require("body-parser").urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
//database connection
const uri="mongodb+srv://naveen:naveen@cluster0.ge3rdkw.mongodb.net/";
mongoose.connect(uri);

const schema = {
    thing : String,
};

const SSchema = {
    title: String,
    listt: [schema]
}

const Item = mongoose.model("item", schema);
const List = mongoose.model("list",SSchema);

const item1 = new Item({
    thing : "Welcome to Todo list!!"
});
const item2 = new Item({
    thing : "Fill the box amd hit + button to add a new item"
});
const item3 = new Item({
    thing : "click the checkbox button to delete the item"
});

//Item.insertMany([item1,item2,item3]);
// main server
app.get("/",function(req,res){

    Item.find(function(err,results){
        res.render("list",{Title:"Today",new_item:results});
    });
});

//another custom list
app.get("/:cont",function(req,res){
    //console.log(Item);
    var heading=_.capitalize(req.params.cont);
    List.findOne({title: heading},function(err, option){
        if(!err){
            if(option){
                //console.log()
                res.render("list",{Title: option.title, new_item: option.listt});
            }
            else{
                const list1 =new List({
                    title: heading,
                    listt: [item1,item2,item3]
                });
                list1.save();
                res.redirect("/"+req.params.cont);
            }
        }
        else{
            console.log(err);
        }
    });
    //res.redirect("/"+req.params.cont);
});

// Adding item
app.post("/",function(req,res){
    var heading = req.body.list;
    var text= req.body.Addwork;
    const itemm = new Item({
        thing : text
    });
    if(heading==="Today"){
        itemm.save();
        res.redirect("/");
    }
    else{
        List.findOne({title:heading},function(err,_list){
            _list.listt.push(itemm);
            _list.save();
            res.redirect("/"+heading);
        });
    }
});

//deleting an item
app.post("/delete",function(req,res){
    var heading = req.body.ListName;
    var ItemId = req.body.checkBox;
    if(heading==="Today"){
        Item.deleteOne({_id: ItemId},function(err){
            if(!err){
                console.log("successfully deleted!");
                res.redirect("/");
            }
        });
    }
    else{
        List.findOneAndUpdate({title: heading},{$pull: {listt: {_id: ItemId}}},
        function(err,result){
            if(!err){
                res.redirect("/"+heading);
            }
        });
    }
});

//To start the server
app.listen(3000,function(req,res){
   console.log("servers is set to port 3000");
});
