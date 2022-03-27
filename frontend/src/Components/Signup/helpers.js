export const nameHandler = (e, setFunction, signupData) => {
    let newData = {...signupData, name:e.target.value};
    setFunction(newData);
}

export const profilePhotoHandler = async (e, setFunction, signupData) => {
    let newfile = e.target.files;
    let newData = {...signupData, profileImg:newfile[0]};
    setFunction(newData);
}

export const leetcodeHandler = (e, setFunction, signupData) =>{
    let newData = {...signupData, leetCode:e.target.value};
    setFunction(newData);
}

export const codeforcesHandler = (e, setFunction, signupData) =>{
    let newData = {...signupData, codeforces:e.target.value};
    setFunction(newData);
}

export const githubHandler = (e, setFunction, signupData) =>{
    let newData = {...signupData, github:e.target.value};
    setFunction(newData);
}

export const emailHandler = (e, setFunction) => {
    setFunction(e.target.value);
}

export const passwordHandler = (e, setFunction) => {
    setFunction(e.target.value);
}

export const formvalidate = ( email, password, signupData,setError ) => {
    if (email === "") {
        setError("Email Field is Required!");
        return false;
    }
    if (password === "") {
        setError("Password Field is Required!");
        return false;
    }
    if (email !== "" || password !== "") {
        if (!email.includes("@") && !email.includes(".")) {
            setError("Enter Valid Email ID!");
            return false;
        }
        if (password.length < 8) {
            setError("Password must be 8 Digit Long!");
            return false;
        }
    }
    if(signupData.name === ""){
        setError("Name Field Cannot be Blank!");
        return false;
    }
    if(signupData.profileImg === {}){
        setError("Please Upload Profile Photo");
        return false;
    }
    if(signupData.leetCode === ""){
        setError("Leetcode Url is Required!");
        return false;
    }
    if(signupData.codeforces === ""){
        setError("Codeforces Url is Required!");
        return false;
    }
    if(signupData.github === ""){
        setError("Github Url is Required!");
        return false;
    }

    return true;
}