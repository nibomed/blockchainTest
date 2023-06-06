async function getABI() {
  // Insert code here to fetch the contract ABI
}

async function init() {
  const contractABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"operation","type":"string"},{"indexed":true,"internalType":"uint256","name":"a","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"b","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"result","type":"uint256"}],"name":"Result","type":"event"},{"inputs":[{"internalType":"uint256","name":"a","type":"uint256"},{"internalType":"uint256","name":"b","type":"uint256"}],"name":"add","outputs":[{"internalType":"uint256","name":"result","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"a","type":"uint256"},{"internalType":"uint256","name":"b","type":"uint256"}],"name":"divide","outputs":[{"internalType":"uint256","name":"result","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"a","type":"uint256"},{"internalType":"uint256","name":"b","type":"uint256"}],"name":"multiply","outputs":[{"internalType":"uint256","name":"result","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"a","type":"uint256"},{"internalType":"uint256","name":"b","type":"uint256"}],"name":"subtract","outputs":[{"internalType":"uint256","name":"result","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"usageCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
  const contractAddress = "0x1851ffBce02A134eFd9ddBC91920b0c6DCEfB6f5";
  let contract;

  const numberA = document.querySelector("#numberA");
  const numberB = document.querySelector("#numberB");
  const operation = document.querySelector("#operation");
  const result = document.querySelector("#result");
  const calculate = document.querySelector("#calculate");
  const output = document.querySelector("#output");

  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      contract = new ethers.Contract(contractAddress, contractABI, provider.getSigner());
      calculate.disabled = false;
    } catch (err) {
      console.error(err);
    }
  }

  if (contract) {
    try {
      const usageCount = await contract.usageCount();
      output.value = `Calculator used: ${usageCount} times`;
    } catch (err) {
      console.error(err);
    }
  }

  calculate.addEventListener("click", async () => {
    if (!contract) return;
    try {
      const a = parseInt(numberA.value);
      const b = parseInt(numberB.value);
      let tx;
      switch (operation.value) {
        case "+":
          tx = await contract.add(a, b);
          break;
        case "-":
          tx = await contract.subtract(a, b);
          break;
        case "*":
          tx = await contract.multiply(a, b);
          break;
        case "/":
          tx = await contract.divide(a, b);
          break;
        default:
          return;
      }
      const receipt = await tx.wait();
      const resEvent = receipt.events.find(event => event.event === "Result");
      if (resEvent) {
        result.value = resEvent.args[3].toString();
      }
    } catch (err) {
      console.error(err);
    }
  });
}

init();
