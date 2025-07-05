const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

main()
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on port -> ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello WanderLUST');
});

// app.get('/testlisting',(req,res)=>{
//      let samplelisting = new Listing({
//         title: "Sample Listing",
//         description: "This is a sample listing description.",
//         price: "100",
//         location: "Sample Location",
//         country: "Sample Country"
//     });
    
//     samplelisting.save()
//     .then(() => {
//         res.send('Sample listing saved successfully!');
//         console.log('Sample listing saved successfully!');
//     })
//     .catch(err => {
//         console.error('Error saving sample listing:', err);
//         res.status(500).send('Error saving sample listing');
//     });
// });

// Route to fetch all listings and render the index page
// This route will fetch all listings from the database and render the index.ejs template with the listings data.
app.get('/listings', (req, res) => {
    Listing.find({})
    .then((allListings) => {
        res.render('index.ejs',{allListings});
        console.log('Listings fetched successfully');
    })
    .catch((err) => {
        console.error('Error fetching listings:', err);
    });
});

// we have to write it on above of :id route beause if it below it
// it will not work as it will match the :id route first
app.get('/listings/new', (req, res) => {
    res.render('new.ejs');
    console.log('Creating new Listing');
})

// Route to fetch a specific listing by ID and render the show page
// This route will fetch a specific listing from the database using its ID and render the show.ejs template with the listing data.
app.get('/listings/:id',async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    res.render('show.ejs', {listing});
    console.log(`details fetched for (${listing.title})`);
});

app.post('/listings', async (req, res) => {
    // const { title, description, price, location, country } = req.body;
    const listingData = req.body.listing;
    const newListing = new Listing(listingData);
    await newListing.save();
    console.log('New listing created:', newListing);
    res.redirect('/listings');
});

app.get('/listings/:id/edit', async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('edit.ejs', {listing});
    console.log(`Editing the list (${listing.title})`);
});

app.put('/listings/:id', async (req, res) => {
    let {id} = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    console.log(`Listing updated: ${updatedListing}`);
    res.redirect(`/listings/${id}`);
});

app.delete('/listings/:id', async (req, res) => {
    let {id} = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(`Listing ${deletedList} deleted successfully`);
    res.redirect('/listings');
});