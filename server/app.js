const express = require("express")
const { ApolloServer,gql }=require("apollo-server-express")
const {graphqlUploadExpress,GraphQLUpload}=require("graphql-upload")
const handleFileUploadS3=require("./storeImageS3")
const handleFileUploadLocally= require("./storeImageLocally")
const handleFileUploadMongoDB= require("./storeImageInMongoDB")
const stream = require("stream")
const mongoose = require("mongoose")
const ImagesCollection = require("./model/ImageSchema")


mongoose.connect("mongodb://127.0.0.1:27017/graphql_images",()=>{
  console.log("DB connection established")
})




const typeDefs = gql` 
scalar Upload
type Query {
    test:String
}
type File {
    filename: String!
    imageUrl:String!
  }
type Mutation{
    singleUpload(file: Upload!,storage:String!): File!
}

`
const resolvers = { 
    Upload: GraphQLUpload,
    Query:{
        test:()=>("Working ....")
    },
    Mutation: {
        singleUpload: async (parent, { file ,storage}) => {
          
          switch(storage){
            case "s3":
              const response = await handleFileUploadS3(file)  
              return response;
            case "local_server":
              const res= await handleFileUploadLocally(file)
              return res;
            case "mongodb":
              const respon= await handleFileUploadMongoDB(file)
              return {filename:respon.filename, imageUrl:respon.imageUrl}
          }
          //upload on S3
         /*  const response = await handleFileUploadS3(file)  
          return response; */


          //store locally on server
         /*  const response= await handleFileUploadLocally(file)
          return response */

          //store image in database
        /*   const response= await handleFileUploadMongoDB(file)
          return {filename:response.filename, imageUrl:response.imageUrl} */

        },
      },
    };
    



async function startServer() {
    const server = new ApolloServer({
      typeDefs,
      resolvers
    });
    await server.start();
  
    const app = express();
    //serve static pages from public folder
 
    app.use(graphqlUploadExpress());
  
    server.applyMiddleware({ app });

    app.use(express.static(__dirname+"/public"))

    //serving image from databse
    app.get("/db/images/:filename",async (req,res)=>{
      const image=await ImagesCollection.findOne({filename:req.params.filename}) 
      if(image){
         const readStream= stream.Readable.from(image.data)
      readStream.pipe(res)
      }else{
        res.send("no image found")
      }
     
    })

    // This middleware should be added before calling `applyMiddleware`.
    app.listen(4000,()=> console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    )
  
  }
  
  startServer();