#!/usr/bin/env node
let inputArr = process.argv.slice(2) //process.argv is used to take input from command line
let path = require("path")
let fs = require("fs")
let fileTypes = {
    media: ["mp4", "mvk"],
    archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
    documents: ["docx", "doc", "pdf", "xlsx", "xls", "odt", "ods", "odp", "odg", "odf", "txt", "ps", "tex"],
    app: ["exe", "dmg", "pkg", "deb"]
}
//We have to make 3 commands: tree, organize and help

let command = inputArr[0]

if(command == "tree"){
    treefn(inputArr[1])

}
else if(command == "organize"){
    organizefn(inputArr[1])
}
else if(command == "help"){
    helpfn()
}
else{
    console.log("Enter valid command")
}


function treefn(dirPath){
    //let destPath

    if(dirPath==undefined){
        treeHelper(process.cwd(), "")
        return
    }

    else{
        let doesExist=fs.existsSync(dirPath);

        if(doesExist){
            treeHelper(dirPath, "")
        }
        else{
            console.log("Enter a valid path");
            return; 
        }
    }
}

function treeHelper(dirPath, indent){
   let isFile = fs.lstatSync(dirPath).isFile()
   if(isFile == true){
        let fileName = path.basename(dirPath)
        console.log(indent + "├──" + fileName)
   }
   else{
        let dirName = path.basename(dirPath)
        console.log(indent + "└──" + dirName )
        let children = fs.readdirSync(dirPath)
        for(i=0; i < children.length; i++){
            let childPath = path.join(dirPath, children[i])
            treeHelper(childPath, indent + "\t")
        }
   }
}

function organizefn(dirPath){
    let destPath

    if(dirPath==undefined){
        destPath = process.cwd()
        return
    }

    else{
        let doesExist=fs.existsSync(dirPath);

        if(doesExist){
            destPath=path.join(dirPath,"Organized Files");
            
            if(fs.existsSync(destPath)==false){
            fs.mkdirSync(destPath);
            }
            else {
                console.log("Directory Already Exists !")
            }

        }else{
            console.log("Enter a valid path");
            return; 
        }
    }

organizeHelper(dirPath, destPath)
console.log("All Files have been organized")

}

function helpfn(){
    console.log(`
    All the commands are :
        tree : to get the structure
        organize : to organize the directory
        help : to get list of the commands
                `)
}

function organizeHelper(dirPath, destPath){
    let files = fs.readdirSync(dirPath)
    //console.log(files)
    for(i=0;i<files.length;i++){
         let filePath = path.join(dirPath, files[i])
         let isFile = fs.lstatSync(filePath).isFile()

         if(isFile){
            //console.log(files[i])
            let currFile = files[i]
            let category = getCategory(files[i])
            //console.log(currFile, "belongs to -->>", category)

            sendFiles(filePath, destPath, category)             
         }
    }
}

function getCategory(fileName){
    let ext = path.extname(fileName)
    ext = ext.slice(1)//to remove . in front
    //console.log(ext)
    for(type in fileTypes){
        let currTypeArr = fileTypes[type]

        for(i = 0; i < currTypeArr.length; i++){
            if(ext==currTypeArr[i]){
                return type 
            }
        }

    }
    return "Unknown"    
}

function sendFiles(src, destPath, category){

    let categoryPath = path.join(destPath, category)
    let cpExists = fs.existsSync(categoryPath)
    if(cpExists == false){
        fs.mkdirSync(categoryPath)
    }
    let fileName = path.basename(src)
    let destFilePAth = path.join(categoryPath, fileName)
    fs.copyFileSync(src, destFilePAth)
    //console.log(fileName, "Copied")

}