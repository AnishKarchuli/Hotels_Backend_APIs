const express = require("express");
const app = express();
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

require("dotenv").config();
const { initializeDatabase } = require("./db/db.connect");
const Hotel = require("./models/hotels.models");

app.use(express.json());

initializeDatabase();

async function createHotel(newHotel) {
  try {
    const hotel = new Hotel(newHotel);
    const saveHotel = await hotel.save();
    return saveHotel;
  } catch (error) {
    throw error;
  }
}

app.post("/hotels", async (req, res) => {
  try {
    const savedHotel = await createHotel(req.body);
    res
      .status(201)
      .json({ message: "Hotel added successfully", hotel: savedHotel });
  } catch (error) {
    res.status(500).json({ error: "Failed to add hotels." });
  }
});

// read all Hotels from the database
async function readAllHotels() {
  try {
    const allHotels = await Hotel.find();
    return allHotels;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels", async (req, res) => {
  try {
    const hotels = await readAllHotels();
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "No hotels found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels." });
  }
});

// read hotel by name
async function readHotelByName(hotelName) {
  try {
    const hotel = await Hotel.findOne({ name: hotelName });
    return hotel;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotel = await readHotelByName(req.params.hotelName);
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel." });
  }
});

// read hotel by phone number
async function readHotelByPhoneNumber(phoneNumber) {
  try {
    const hotel = await Hotel.findOne({ phoneNumber: phoneNumber });
    return hotel;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/directory/:phoneNumber", async (req, res) => {
  try {
    const hotel = await readHotelByPhoneNumber(req.params.phoneNumber);
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch {
    res.status(500).json({ error: "Failed to fetch hotel." });
  }
});

// read all hotels by rating
async function readAllHotelsByRating(rating) {
  try {
    const allHotels = await Hotel.find({ rating: rating });
    return allHotels;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotels = await readAllHotelsByRating(req.params.hotelRating);
    if (hotels) {
      res.json(hotels);
    } else {
      res.json({ error: "Hotels not found." });
    }
  } catch (error) {
    res.json({ error: "Failed to fetch hotels." });
  }
});

// read all hotels by category
async function readAllHotelsByCategory(categoryName) {
  try {
    const allHotels = await Hotel.find({ category: categoryName });
    return allHotels;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/category/:hotelCategory", async (req, res) => {
  try {
    const hotels = await readAllHotelsByCategory(req.params.hotelCategory);
    if (hotels) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "Hotels not found." });
    }
  } catch (error) {
    res.json({ error: "Failed to fetch hotels." });
  }
});

async function deleteHotel(hotelId){
    try{
        const deletedHotel = await Hotel.findByIdAndDelete(hotelId)
        return deletedHotel;
    }catch(error){
        console.log(error);
    }
}

app.delete('/hotels/:hotelId', async (req, res) => {
    try{
        const deletedHotel = await deleteHotel(req.params.hotelId)
        if(deletedHotel){
            res.status(200).json({message: 'Hotel deleted successfully.'})
        } else {
            res.status(404).json({error: 'Hotel not found.'})
        }
    }catch(error){
        res.status(500).json({error: 'Failed to fetch a hotel.'})
    }
})

async function updateHotel(hotelId, dataToUpdate){
    try{
        const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, dataToUpdate, { new: true })
        return updatedHotel;
    }catch(error){
        console.log('Error in updating hotel data', error);
    }
}

app.post('/hotels/:hotelId', async (req, res) => {
    try{
        const updatedHotel = await updateHotel(req.params.hotelId, req.body)
        if(updatedHotel){
            res.status(200).json({message: 'Hotel updated successfully', updatedHotel: updatedHotel})
        } else {
            res.status(404).json({error: 'Hotel not found.'})
        }
    }catch(error){
        res.status(500).json({error: 'Failed to update hotel data.'})
    }
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}.`);
});