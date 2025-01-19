import Joi from 'joi';

export const userSchema = Joi.object({               
  empId: Joi.string().required(),                   
  name: Joi.string().required(),       
  password:Joi.string().required(),           
  phno: Joi.string().required(),                    
  dept: Joi.string().required(), 
  campus: Joi.string().required(),         
  panNo: Joi.string().required(),                 
  qualification: Joi.string().required(),          
  designation: Joi.string().required(),             
  expertise: Joi.string().required(),               
  dateofJoining: Joi.date().required(),             
  totalExpBfrJoin: Joi.string().required(),        
  googleScholarId: Joi.string().required(),    
  role: Joi.string().default('user'),
  accessTo: Joi.string().default('none'),    
  sId: Joi.string().required(),                    
  oId: Joi.string().required(),                     
  profileImg: Joi.string().optional(),             
});

export const loginSchema = Joi.object({               
    empId: Joi.string().required(),                     
    password:Joi.string().required(),                       
  });