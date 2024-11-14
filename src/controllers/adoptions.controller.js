import { PetServices } from "../services/pet.service.js";
import { UserServices } from "../services/user.service.js";
import { AdoptionServices } from "../services/adoption.service.js";
import mongoose from 'mongoose';


export class AdoptionsController {
  constructor() {
    this.adoptionsService = new AdoptionServices();
    this.usersService = new UserServices();
    this.petsService = new PetServices();
  }

  getAllAdoptions = async (req, res, next) => {
    try {
      const result = await this.adoptionsService.getAll();
      res.send({ status: "success", payload: result });
    } catch (error) {
      next(error);
    }
  };


getAdoption = async (req, res, next) => {
  try {
    const adoptionId = req.params.aid;

    if (!mongoose.Types.ObjectId.isValid(adoptionId)) {
      return res.status(400).send({ status: "error", error: "Invalid Adoption ID" });
    }

    const adoption = await this.adoptionsService.getById(adoptionId);
    
    if (!adoption) {
      return res.status(404).send({ status: "error", error: "Adoption not found" });
    }

    res.send({ status: "success", payload: adoption });
  } catch (error) {
    console.error("Error in getAdoption:", error);
    next(error);
  }
};

  createAdoption = async (req, res, next) => {
    try {
      const { uid, pid } = req.params;
  
      const user = await this.usersService.getById(uid);
      if (!user) return res.status(404).send({ status: "error", error: "User not found" });
  
      const pet = await this.petsService.getById(pid); 
      if (!pet) return res.status(404).send({ status: "error", error: "Pet not found" });
  
      if (pet.adopted) return res.status(400).send({ status: "error", error: "Pet is already adopted" });
  
      user.pets.push(pet._id);
      await this.usersService.update(user._id, { pets: user.pets });
      await this.petsService.update(pet._id, { adopted: true, owner: user._id });
  
      const adoption = await this.adoptionsService.create({ owner: user._id, pet: pet._id });
  
      res.status(200).json({ status: "success", message: "Pet adopted", payload: adoption });
    } catch (error) {
      next(error);
    }
  };

  deleteAdoption = async (req, res, next) => {
    try {
      const adoptionId = req.params.aid;
      const result = await this.adoptionsService.remove(adoptionId);
      
      if (result === "ok") {
        return res.status(200).send({ status: "success", message: "Adoption deleted" });
      } else {
        return res.status(404).send({ status: "error", error: "Adoption not found" });
      }
    } catch (error) {
      next(error);
    }
  };
};