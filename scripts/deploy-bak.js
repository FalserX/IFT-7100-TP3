async function main() {  
    const MySepolia = await ethers.getContractFactory("MySepolia");     
    const MySepoliaContract = await MySepolia.deploy();
    console.log("Contract deployed to address:",      MySepoliaContract.address);
  }
  main().then(() => 
    process.exit(0)
  ).catch((error) => {        
     console.log(error);    
     process.exit(1);  
  });