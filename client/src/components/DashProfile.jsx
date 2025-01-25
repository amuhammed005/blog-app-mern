import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state?.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  console.log(imageFileUploadProgress, imageFileUploadError);
  const filePickerRef = useRef();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  //   console.log(imageFile, imageFileUrl);
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //           allow read;
    //           allow write: if
    //           request.resource.size < 2 * 1024 * 1024 &&
    //           request.resource.contentType.matches("image/.*")
    //     }
    //   }
    // }
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)",
          error
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
        });
      }
    );
    // console.log("uploading image...");
  };
  return (
    <div className="w-full max-w-lg mx-auto p-3">
      <h1 className="text-center my-7 font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full "
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePhoto}
            alt="current user"
            className={`w-full h-full object-cover border-8 border-[lightgray] rounded-full ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="password" />
        <Button type="submit" gradientDuoTone="purpleToBlue">
          Update
        </Button>
        <div className="text-red-500 flex justify-between my-4">
          <span>Delete Account</span>
          <span>Sign Out</span>
        </div>
      </form>
    </div>
  );
}

// import { Alert, Button, TextInput } from "flowbite-react";
// import { useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { updateProfilePhoto } from "../redux/user/userSlice";

// export default function DashProfile() {
//   const { currentUser } = useSelector((state) => state.user);
//   const dispatch = useDispatch();

//   const [imageFile, setImageFile] = useState(null);
//   console.log(imageFile);
//   const [imageFileUrl, setImageFileUrl] = useState(
//     currentUser?.profilePhoto || null
//   );
//   const [imageFileUploadError, setImageFileUploadError] = useState(null);
//   const filePickerRef = useRef();

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         setImageFileUploadError("File must be less than 2MB");
//         return;
//       }
//       setImageFile(file);

//       // Use FileReader to generate a preview URL
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImageFileUrl(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleUpdateProfile = (e) => {
//     e.preventDefault();
//     if (imageFileUrl) {
//       dispatch(updateProfilePhoto(imageFileUrl)); // Update Redux store
//       alert("Profile updated successfully!");
//     }
//   };

//   return (
//     <div className="w-full max-w-lg mx-auto p-3">
//       <h1 className="text-center my-7 font-semibold text-3xl">Profile</h1>
//       <form className="flex flex-col gap-4" onSubmit={handleUpdateProfile}>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           ref={filePickerRef}
//           hidden
//         />
//         <div
//           className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full "
//           onClick={() => filePickerRef.current.click()}
//         >
//           <img
//             src={imageFileUrl || "/default-avatar.png"} // Default avatar fallback
//             alt="current user"
//             className="w-full h-full object-cover border-8 border-[lightgray] rounded-full"
//           />
//         </div>
//         {imageFileUploadError && (
//           <Alert color="failure">{imageFileUploadError}</Alert>
//         )}
//         <TextInput
//           type="text"
//           id="username"
//           placeholder="username"
//           defaultValue={currentUser?.username}
//         />
//         <TextInput
//           type="email"
//           id="email"
//           placeholder="email"
//           defaultValue={currentUser?.email}
//         />
//         <TextInput type="password" id="password" placeholder="password" />
//         <Button type="submit" gradientDuoTone="purpleToBlue">
//           Update
//         </Button>
//         <div className="text-red-500 flex justify-between my-4">
//           <span>Delete Account</span>
//           <span>Sign Out</span>
//         </div>
//       </form>
//     </div>
//   );
// }
