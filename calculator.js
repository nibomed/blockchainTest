// calculator.js
window.addEventListener('load', function() {
  // Check if Metamask is installed
  if (typeof window.ethereum !== 'undefined') {
    // Check if Metamask is connected
    ethereum.request({ method: 'eth_accounts' })
    .then(function(accounts) {
      if (accounts.length === 0) {
        // Metamask is not connected
      } else {
        // Metamask is connected
        // Set up web3
        const web3 = new Web3(window.ethereum);

        // Set up contract
        const contractAddress = "0x1851ffBce02A134eFd9ddBC91920b0c6DCEfB6f5"; // Replace with the address of your Calculator contract on the Sepolia Testnet
        const contractABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"operation","type":"string"},{"indexed":true,"internalType":"uint256","name":"a","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"b","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"result","type":"uint256"}],"name":"Result","type":"event"},{"inputs":[{"internalType":"uint256","name":"a","type":"uint256"},{"internalType":"uint256","name":"b","type":"uint256"}],"name":"add","outputs":[{"internalType":"uint256","name":"result","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"a","type":"uint256"},{"internalType":"uint256","name":"b","type":"uint256"}],"name":"divide","outputs":[{"internalType":"uint256","name":"result","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"a","type":"uint256"},{"internalType":"uint256","name":"b","type":"uint256"}],"name":"multiply","outputs":[{"internalType":"uint256","name":"result","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"a","type":"uint256"},{"internalType":"uint256","name":"b","type":"uint256"}],"name":"subtract","outputs":[{"internalType":"uint256","name":"result","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"usageCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]; // Replace with the ABI of your Calculator contract
        const calculatorContract = new web3.eth.Contract(contractABI, contractAddress);

        // Display usageCount
        calculatorContract.methods.usageCount().call()
        .then(function(usageCount) {
          document.getElementById("outputText").innerHTML = "Calculator used: " + usageCount;
        });

        document.getElementById("calculateBtn").disabled = false;
        // Set up event listener for calculate button
        document.getElementById("calculateBtn").addEventListener("click", function() {
          var digitA = document.getElementById("digitA").value;
          var operation = document.getElementById("operation").value;
          var digitB = document.getElementById("digitB").value;
          var result = document.getElementById("result");
          var outputText = document.getElementById("outputText");

          if (digitA && operation && digitB) {
            // Call contract function based on selected operation
            switch (operation) {
              case "+":
                calculatorContract.methods.add(digitA, digitB).send({ from: accounts[0] })
                .then(function(receipt) {
                  result.value = receipt.events.Result.returnValues.result;
                  outputText.innerHTML = "The result of " + digitA + " " + operation + " " + digitB + " is " + result.value;
                });
                break;
              case "-":
                calculatorContract.methods.subtract(digitA, digitB).send({ from: accounts[0] })
                .then(function(receipt) {
                  result.value = receipt.events.Result.returnValues.result;
                  outputText.innerHTML = "The result of " + digitA + " " + operation + " " + digitB + " is " + result.value;
                });
                break;
              case "*":
                calculatorContract.methods.multiply(digitA, digitB).send({ from: accounts[0] })
                .then(function(receipt) {
                  result.value = receipt.events.Result.returnValues.result;
                  outputText.innerHTML = "The result of " + digitA + " " + operation + " " + digitB + " is " + result.value;
                });
                break;
              case "/":
                calculatorContract.methods.divide(digitA, digitB).send({ from: accounts[0] })
                .then(function(receipt) {
                  result.value = receipt.events.Result.returnValues.result;
                  outputText.innerHTML = "The result of " + digitA + " " + operation + " " + digitB + " is " + result.value;
                });
                break;
            }
          } else {
            outputText.innerHTML = "";
          }
        });
      }
    })
    .catch(function(error) {
      console.error(error);
    });
  }
});
