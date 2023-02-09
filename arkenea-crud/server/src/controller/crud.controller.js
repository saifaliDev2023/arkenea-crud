const Joi = require('joi');
const { Crud } = require('../model');
const CustomeErrorHandler = require('../service/CustomeErrorHandler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PORT } = require('../config');
let portUrl = `http://localhost:${PORT}`;


// Define multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../upload')),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const handleMultipartData = multer({ storage, limits: { fieldSize: 1000000 * 5 } }).single('profile_image');

const crudController = {
    async create(req, res, next) {

        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomeErrorHandler.serverError(err.messages));
            }

            let filePath, fileName;
            if (req.file) {
                filePath = req.file.path;
                fileName = req.file.filename;
            }

            const crudSchema = Joi.object({
                first_name: Joi.string().required(),
                last_name: Joi.string().required(),
                email: Joi.string().email(),
                phone_number: Joi.string().regex(/^[0-9]{10}$/).messages({ 'string.pattern.base': `Phone number must have 10 digits.` }).required(),
                profile_image: Joi.string(),
            });

            const { error } = crudSchema.validate(req.body);

            if (error) {
                if (req.file) {
                    fs.unlinkSync(filePath, (err) => {
                        if (err) return next(CustomeErrorHandler.serverError(err.messages));
                    });
                }
                return next(error);
            }

            try {
                const email = await Crud.exists({ email: req.body.email });
                if (email) {
                    if (req.file) {
                        fs.unlinkSync(filePath, (err) => {
                            if (err) return next(CustomeErrorHandler.serverError(err.messages));
                        });
                    }
                    return next(CustomeErrorHandler.alreadyExist('Email is already exists'));
                }

                const phone_number = await Crud.exists({ phone_number: req.body.phone_number });
                if (phone_number) {
                    if (req.file) {
                        fs.unlinkSync(filePath, (err) => {
                            if (err) return next(CustomeErrorHandler.serverError(err.messages));
                        });
                    }
                    return next(CustomeErrorHandler.alreadyExist('Phone Number is already exists'));
                }
            } catch (error) {
                return next(error);
            }

            const { first_name, last_name, email, phone_number } = req.body;

            try {
                const createRec = await Crud.create({
                    first_name,
                    last_name,
                    email,
                    phone_number,
                    ...(req.file && {profile_image: fileName} )
                });
            } catch (error) {
                return next(error);
            }

            res.status(201).json({
                statusCode: 201,
                msg: "Data is inserted successfully",
                data: { ...req.body, ...(req.file && {profile_image: fileName} ) }
            });

        });

    },

    async getAll(req, res, next) {

        let records = {};
        try {
            records = await Crud.find({});
            // console.log(path.join(__dirname, `/../upload/`));
            // console.log(records);
        } catch (error) {
            return next(error);
        }

        res.status(201).json({
            statusCode: 201,
            msg: "Data is find successfully",
            data: records
        });

    },

    async getOne(req, res, next) {

        let record = {};
        let imageUrl;
        try {
            record = await Crud.findOne({ _id: req.params.id });
            imageUrl = `${portUrl}/upload/${record.profile_image}`;
        } catch (error) {
            return next(error);
        }

        res.status(201).json({
            statusCode: 201,
            msg: "Data is find successfully",
            data: { record, imageUrl: imageUrl }
        });

    },

    async updateOne(req, res, next) {

        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomeErrorHandler.serverError(err.messages));
            }

            let filePath, fileName;
            if (req.file) {
                filePath = req.file.path;
                fileName = req.file.filename;
            }

            const crudSchema = Joi.object({
                first_name: Joi.string().required(),
                last_name: Joi.string().required(),
                email: Joi.string().email(),
                phone_number: Joi.string().regex(/^[0-9]{10}$/).messages({ 'string.pattern.base': `Phone number must have 10 digits.` }).required(),
                profile_image: Joi.string(),
            });

            const { error } = crudSchema.validate(req.body);

            if (error) {
                if (req.file) {
                    fs.unlinkSync(filePath, (err) => {
                        if (err) return next(CustomeErrorHandler.serverError(err.messages));
                    });
                }
                return next(error);
            }

            let updateRec;
            try {
                updateRec = await Crud.findOneAndUpdate({ _id: req.params.id }, { ...req.body, ...(req.file && { profile_image: fileName }) });
                if (req.file) {
                    fs.unlinkSync(path.join(filePath, `/../${updateRec.profile_image}`), (err) => {
                        if (err) return next(CustomeErrorHandler.serverError(err.messages));
                    });
                }
            } catch (error) {
                if (req.file) {
                    fs.unlinkSync(filePath, (err) => {
                        if (err) return next(CustomeErrorHandler.serverError(err.messages));
                    });
                }
                return next(error);
            }

            res.status(201).json({
                statusCode: 204,
                msg: "Data is update successfully",
                data: { ...req.body, profile_image: fileName }
            });

        });

    },

    async delete(req, res, next) {
        let document = {};
        let filePath;
        try {
            document = await Crud.findOne({ _id: req.params.id });
            if(document.profile_image){
                const filePath = path.join(__dirname, `/../upload/${document.profile_image}`);
                // filePath = `${portUrl}/upload/${document.profile_image}`;
                fs.unlinkSync(filePath, (err) => {
                    if (err) return next(CustomeErrorHandler.serverError(err.messages));
                });
            };
            let deleteRec = await Crud.deleteOne({ _id: req.params.id });
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