import React, { useEffect, useState } from 'react';
import useSettings from '../../../hooks/useSettings';
import { useUpdateSettings } from '../../../hooks/useUpdateSettings';
import { toast } from 'react-toastify';

const Contact = () => {
    const {settings} = useSettings();
    const {updateSettings,success} = useUpdateSettings();
    const [email,setEmail] = useState(null);
    const [whatsapp,setWatsapp] = useState(null);
    useEffect(()=>{
        if(settings){
            setEmail(settings?.email);
            setWatsapp(settings?.whatsapp);
        }
    },[settings])

    const handleChane =(e)=>{
        if(e.target.name==='email'){
            setEmail(e.target.value);
        }else{
            setWatsapp(e.target.value);
        }
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        const updatedData = {
            email,
            whatsapp
        }
        updateSettings(updatedData);
        if(success===true){
            toast.success("Saved successfully");
        }
    }


    return (
        <div>
            <div className="flex flex-col items-center gap-4 p-6 rounded-md shadow-md sm:py-8 sm:px-12 bg-white text-black w-full min-h-[90vh]">
                    

                    <h2 className="text-2xl font-semibold leading-tight tracking-wide">Contact</h2>
                    
                    <div className="w-full mx-auto p-6 bg-white ">
                        <form 
                        onSubmit={handleSubmit} 
                        >
                            <div className='grid grid-cols-2 gap-4'>
                         
                         
                            
                            <div className="mb-4 w-full">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor="whatsapp">
                                What's app
                                </label>
                                <input
                                    type="text"
                                    id="whatsapp"
                                    name="whatsapp"
                                    value={whatsapp}
                                    onChange={handleChane}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter whats app number"
                                    required
                                />
                            </div>

                            <div className="mb-4 w-full">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                               Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={handleChane}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter email"
                                    required
                                />
                            </div>

                           
                            </div>
                            <div className="mb-4 flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Save
                                </button>
                            </div>
                            
                        </form>
                       
                    </div>                   
                </div> 


        </div>
//          <script type="text/javascript">
// var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
// (function(){
// var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
// s1.async=true;
// s1.src='https://embed.tawk.to/66c8bd2050c10f7a009fbebc/1i6025ju4';
// s1.charset='UTF-8';
// s1.setAttribute('crossorigin','*');
// s0.parentNode.insertBefore(s1,s0);
// })();
// </script> 
    );
    
};

export default Contact;


