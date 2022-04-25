export const nameHandler = (e, setFunction, signupData) => {
  let newData = { ...signupData, name: e.target.value };
  setFunction(newData);
};

export const profilePhotoHandler = async (e, setFunction, signupData) => {
  let newfile = e.target.files;
  let newData = { ...signupData, profileImg: newfile[0] };
  setFunction(newData);
};

export const leetcodeHandler = (e, setFunction, signupData) => {
  let newData = { ...signupData, leetcode: e.target.value };
  setFunction(newData);
};

export const codechefHandler = (e, setFunction, signupData) => {
  let newData = { ...signupData, codechef: e.target.value };
  setFunction(newData);
};

export const codeforcesHandler = (e, setFunction, signupData) => {
  let newData = { ...signupData, codeforces: e.target.value };
  setFunction(newData);
};

export const githubHandler = (e, setFunction, signupData) => {
  let newData = { ...signupData, github: e.target.value };
  setFunction(newData);
};

export const emailHandler = (e, setFunction, signupData) => {
  let newData = { ...signupData, email: e.target.value };
  setFunction(newData);
};

export const passwordHandler = (e, setFunction, signupData) => {
  let newData = { ...signupData, password: e.target.value };
  setFunction(newData);
};
