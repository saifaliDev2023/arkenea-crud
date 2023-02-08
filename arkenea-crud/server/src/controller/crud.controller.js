const Joi = require('joi');
const { Crud } = require('../model');
const CustomeErrorHandler = require('../service/CustomeErrorHandler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'upload/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const handleMultipartData = multer({storage, limits: { fieldSize: 1000000 * 5} }).single('profile_image');

const crudController = {
    async create(req, res, next) {
        
        // handleMultipartData(req, res, (err) => {
        //     if(err) {
        //         return next(CustomeErrorHandler.serverError(err.messages));
        //     }

        //     // const filePath = req.file.path;
        //     console.log(req);

        // });

        const crudSchema = Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            email: Joi.string().email(),
            phone_number: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
            profile_image: Joi.string(),
        });

        const { error } = crudSchema.validate(req.body);

        if(error) {
            return next(error);
        }

        try {
            const email = await Crud.exists({email: req.body.email});
            if(email) {
                return next(CustomeErrorHandler.alreadyExist('Email is already exists'));
            }

            const phone_number = await Crud.exists({phone_number: req.body.phone_number});
            if(phone_number) {
                return next(CustomeErrorHandler.alreadyExist('Phone Number is already exists'));
            }
        } catch (error) {
            return next(error);
        }

        try {
            const createRec = await Crud.create(req.body);
        } catch (error) {
            return next(error);
        }

        // console.log(req.body);
        res.status(201).json({
            statusCode: 201,
            msg: "Data is inserted successfully",
            data: req.body
        });

    },

    async getAll(req, res, next) {

        let recods = {};
        try {
            recods = await Crud.find({});
            // console.log(recods);
        } catch (error) {
            return next(error);
        }

        res.status(201).json({
            statusCode: 201,
            msg: "Data is find successfully",
            data: recods
        });

    },

    async updateOne(req, res, next) {
        const crudSchema = Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            email: Joi.string().email().required(),
            phone_number: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
            // profile_image: Joi.string().required(),
        });

        const { error } = crudSchema.validate(req.body);

        if(error) {
            return next(error);
        }

        try {
            const updateRec = await Crud.findOneAndUpdate({_id:req.params.id}, req.body);
            // console.log(updateRec);
        } catch (error) {
            return next(error);
        }

        res.status(201).json({
            statusCode: 204,
            msg: "Data is update successfully",
            data: req.body
        });

    },

    async delete(req, res, next){
        let document = {};
        try {
            document = await Crud.findOne({_id: req.params.id});
            let deleteRec = await Crud.deleteOne({_id: req.params.id});
        } catch (error) {
            return next(error);
        }
        
        res.status(201).json({
            statusCode: 204,
            msg: "Data is delete successfully",
            data: document
        });
    }
    
};

module.exports = crudController;