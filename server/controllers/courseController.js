import Course from "../models/courseModel.js"
import AppError from "../utils/appError.js";
import fs from 'fs/promises';
import path from 'path';
import cloudinary from 'cloudinary';

export const getAllCourses =async(req,res,next)=>{
try {
    const courses = await Course.find({}).select('-lectures');
    res.status(200).json({
        success:true,
        message:"all courses",
        courses

    })
    
} catch (e) {
    return next(new AppError(e.message,500));
    
}
}
export const getCourseById=async(req,res,next)=>{
    try {
        const {courseId}=req.params;
        const course = await Course.findById(courseId);
        if(!course){
            return next(new AppError("invalid course id",500))
        }
        res.status(200).json({
            success:true,
            message:"fetching of course lectures successfull!!",
            lectures:course.lectures
        })
    } catch (error) {
        return next(new(AppError(e.message,500))) 
        
    }

}
export const createCourse= async(req,res,next)=>{
const {title, description,createdBy,category}=req.body;
if(!title||!description||!createdBy||category){
         return next(new AppError("All fields are required!!",400))
        }
        const course =await Course.create({
           title,
           description,
            createdBy,
            category,

        });
        if(!course) {
            return next(
              new AppError('Course could not be created, please try again', 400)
            );
          } 
        if(req.file){
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                  folder: 'lms', // Save files in a folder named lms
                });
                if (result) {
                    // Set the public_id and secure_url in array
                    course.thumbnail.public_id = result.public_id;
                    course.thumbnail.secure_url = result.secure_url;
                  }
 // After successful upload remove the file from local storage
   fs.rm(`uploads/${req.file.filename}`);
        }catch (error) {
            // Empty the uploads directory without deleting the uploads directory
for (const file of await fs.readdir('uploads/')) {
 await fs.unlink(path.join('uploads/', file));  }  
     // Send the error message
       return next(
          new AppError(
          JSON.stringify(error) || 'File not uploaded, please try again',
                400
              )
            );
          }
        }
        await course.save();

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    course,
  });
}
export const updateCourse= async(req,res,next)=>{
    const {courseId}=req.params;
    const course = await Course.findByIdAndUpdate(courseId,{
        $set:req.body
    },{
        runValidators:true
    })
    if(!course){
        return next(new AppError("Course does not exist",400))
    }
    res.status(200).json({
        success:true,
        message:"successfully updated course",
        course
    })
}
export const deleteCourse= async(req,res,next)=>{
    try {
     const {courseId}=req.params;
      
     const course=await Course.findById(courseId);
     if(!course){
        return next(new AppError("could not find course!",500))
     } 
     await Course.findByIdAndDelete(courseId);
     return res.status(200).json({
        success:true,
        message:"course deleted successfully"
     })
    } catch (error) {
        return next(new AppError(error.message,500))
    }
}
export const addLecturesToCourseById=async(req,res,next)=>{
try {
    const {title,description}= req.body;
    if(!title|| !description){
        return next(new AppError("All fields are mandatory",400))
    }
    const {courseId}=req.params;
    const course = await Course.findById(courseId);
    if(!course){
        return next(new AppError("Cannot find course with this id! ",400))
    }
    const lectureData={
        title,description,lecture:{}
    }
    if(req.file){
        const result =await cloudinary.v2.uploader.upload(req.file.path,{
            folder:'lms',

        });

           if(result){lectureData.lecture.public_id=result.public_id;
            lectureData.lecture.secure_url=result.secure_url;}
            courses.lecture.push(lectureData);
            await course.save();
            course.numberOfLectures=course.lectures.length;
            return res.status(201).json({
                success:true,
                message:"Created lecture successfully",
                course
            })


        }
    }catch (error) {
    return next(new AppError(error.message,500))
    
}
}
export const updateLectureById=async(req,res,next)=>{
const {courseId,lectureId}=req.query;
const {title,description}= req.body;


if(!courseId||!lectureId){
    return next(new AppError("CourseId and LectureId are required!",400))
}
const course =await Course.findById(courseId);
if(!course){
    return next(new AppError("No such course exist!",400))   
}
const lectureIndex=course.lectures.findIndex(
    (lecture)=>lecture._id.toString()===  lectureId.toString()
  )
// If returned index is -1 then send error as mentioned below
if (lectureIndex === -1) {
  return next(new AppError('Lecture does not exist.', 404));
}
course.lectures[lectureIndex].title=title;
course.lectures[lectureIndex].description=description;

if(req.file){
    await cloudinary.v2.uploader.destroy(course.lectures[lectureIndex].lecture.public_id);
    try {
        const result = await v2.uploader.upload(req.file.path, {
            folder:'lms',
        });
        if(result){
         course.lectures[lectureIndex].lecture.public_id= result.public_id;
            course.lectures[lectureIndex].lecture.secure_url= result.secure_url;
            //remove file from local server
           //  fs.rm(`uploads/${req.file.fileName}`)
        }
    }catch (error) {
       return next(
           new AppError(error || 'File not uploaded, please try again', 400)
         );
      }
      }
   await course.save();
   return res.status(200).json({
       success:true,
       message:"user updation uccessfully",
       data:course
   })
 }

export const deleteLectureById=async(req,res,next)=>{
    const {courseId,lectureId}=req.query;
    if(!courseId||!lectureId){
        return next(new AppError("CourseId and LectureId are required!",400))
    }
    const course =await Course.findById(courseId);
    if(!course){
        return next(new AppError("No such course exist!",400))   
    }
    const lectureIndex=course.lectures.findIndex(
      (lecture)=>lecture._id.toString()===  lectureId.toString()
    )
// If returned index is -1 then send error as mentioned below
  if (lectureIndex === -1) {
    return next(new AppError('Lecture does not exist.', 404));
  }
  // Delete the lecture from cloudinary
  await cloudinary.v2.uploader.destroy(
    course.lectures[lectureIndex].lecture.public_id,
    {
      resource_type: 'video',
    }
  );

  // Remove the lecture from the array
  course.lectures.splice(lectureIndex, 1);

  // update the number of lectures based on lectres array length
  course.numberOfLectures = course.lectures.length;

  // Save the course object
  await course.save();

  // Return response
  res.status(200).json({
    success: true,
    message: 'Course lecture removed successfully',
  });


}
