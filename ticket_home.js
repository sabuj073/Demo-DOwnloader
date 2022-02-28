import cors from 'cors';
import express from 'express';
import db from '../database.js';
import bcrypt from 'bcrypt';

const ticket_home_router = express.Router();
const saltRounds = 10;
ticket_home_router.use(cors());
ticket_home_router.use(express.json());

ticket_home_router.all('/sliders',(req,res)=>{
    db.query("SELECT * FROM `slider` where status='1'", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/getinfo',(req,res)=>{
    db.query("SELECT * FROM `info`", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/metatag',(req,res)=>{
    const page_name = req.body.name;
    db.query("SELECT * FROM `meta_tag` where page_name=?", [page_name], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/how-to-host',(req,res)=>{
    db.query("SELECT * FROM `how_to_host_show`", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/how-to-buy-ticket',(req,res)=>{
    db.query("SELECT * FROM `how_to_buy_ticket`", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/blogs-limited',(req,res)=>{
    db.query("SELECT *,DATE_FORMAT(date,'%d %M %Y') date from blog ORDER BY date DESC limit 12", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/blogs',(req,res)=>{
    db.query("SELECT *,DATE_FORMAT(date,'%d %M %Y') date from blog ORDER BY date DESC", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/blog-details',(req,res)=>{
    const slug = req.body.slug;
    db.query("SELECT *,DATE_FORMAT(date,'%d %M %Y') date FROM `blog` WHERE blog_slug=?", [slug], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/upcoming-events',(req,res)=>{
    db.query("SELECT * FROM `events`,artist WHERE events.status = 1 and artist.artist_id = events.artist_id and event_starts_date >= CURDATE()", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/event-details',(req,res)=>{
    const slug = req.body.slug;
    db.query("SELECT * FROM `events`,artist WHERE events.status = 1 and artist.artist_id = events.artist_id and events.event_slug=?", [slug], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});


ticket_home_router.all('/all-events',(req,res)=>{
    db.query("SELECT * FROM `events`,artist WHERE events.status = 1 and artist.artist_id = events.artist_id ORDER BY `events`.`event_starts_date` DESC", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/all-artists',(req,res)=>{
    db.query("SELECT * FROM `artist` where status = 1", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/artists-details',(req,res)=>{
    const slug = req.body.slug;
    db.query("SELECT * FROM `artist` where artist_slug=?",[slug], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

ticket_home_router.all('/like-artist',(req,res)=>{
    const slug = req.body.slug;
    db.query("UPDATE artist SET heart = heart+1 where artist_slug=?",[slug], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            res.send(result);
        }
    });
});





ticket_home_router.all('/create-event',(req,res)=>{
    const event_name = req.body.event_name;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const genres = req.body.genres;
    const event_link = req.body.event_link;
    const hear_about = req.body.hear_about;
    const email = req.body.email;
    const contactNumber = req.body.contactNumber;
    const platform = req.body.platform;
    const description = req.body.description;
    const type = "Virtual";
    const event_time = req.body.eventtime;

    db.query(
            "INSERT INTO `event_request` (`event_name`, `start_date`, `end_date`, `genres`, `event_link`,email_address, `hear_about`,contact_number,platform, `description`,type,event_time) VALUES (?, ?, ?, ?, ?,?,?,?, ?, ?, ?);",
            [event_name,start_date,end_date,genres,event_link,email,hear_about,contactNumber,platform,description,type,event_time],(err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });

    ticket_home_router.all('/create-event-offline',(req,res)=>{
        const event_name = req.body.event;
        const start_date = req.body.startDate;
        const end_date = req.body.endDate;
        const address = req.body.address;
        const email = req.body.email;
        const artistBudget = req.body.artistBudget;
        const contactNumber = req.body.contactNumber;
        const description = req.body.description;
        const type = "Offline";
        const event_time = req.body.eventtime;
    
        db.query(
                "INSERT INTO `event_request` (`event_name`, `start_date`, `end_date`, `venue_address`, `artist_budget`,email_address,contact_number, `description`,type,event_time) VALUES (?, ?, ?, ?, ?,?,?,?, ?, ?);",
                [event_name,start_date,end_date,address,artistBudget,email,contactNumber,description,type,event_time],(err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(result);
                }
            });
        });

    ticket_home_router.all('/event-requests',(req,res)=>{
        db.query("SELECT * FROM `event_request` ORDER BY `event_request`.`event_req_id` DESC", (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });

export default ticket_home_router;
