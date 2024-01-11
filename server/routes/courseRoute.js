import { Router } from "express";
import asyncHandler from "../middleware/asyncHandlerMiddleware.js";
import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse,addLecturesToCourseById, deleteLectureById } from "../controllers/courseController.js";
import {isLoggedIn, authorizedRoles, authorizedSubscriber } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";
const courseRoute =Router();
courseRoute.route('/')
.get(getAllCourses)
.post(
     isLoggedIn,authorizedRoles("ADMIN"),
    upload.single('thumbnail'),createCourse)
.delete(isLoggedIn, authorizedRoles('ADMIN'),deleteLectureById);
courseRoute.route('/:courseId')
.get(isLoggedIn,authorizedSubscriber,getCourseById)
.put(isLoggedIn,authorizedRoles("ADMIN"),updateCourse)
.post(isLoggedIn,authorizedRoles("ADMIN"),upload.single('lecture'),addLecturesToCourseById)
.delete(isLoggedIn, authorizedRoles('ADMIN'), deleteCourse)

export default courseRoute;