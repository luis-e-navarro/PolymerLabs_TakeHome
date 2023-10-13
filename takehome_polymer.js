class Network {
    constructor(seedNodes){
        this.network = seedNodes;
        this.networkState = seedNodes.map((node)=>{
            return node.initialState;
        });
        /* iterate seedNodes and bootstrap the networkState*/
        this.network.forEach((node)=>{
            this.bootStrapState(node, this.networkState);       
        })
        this.validValues = [0];
    }

    // add the majority state to node argument
    bootStrapState(node, net){ 
        node.networkState = net; 
    }

    // runs when a new node enters the network
    tx(incomingNode){
        // generate initialState payload from incoming node
        incomingNode.initialState = incomingNode.generatePayload();
    
        // define state placeholder
        const state = [];

        // iterate the network backwards and see if the initial state already exists in network, if so we add one more to that state and assign that value to the state variable
        for (let i = this.network.length - 1; i >= 0; i--) {
            const node = this.network[i];
            if(node.initialState === incomingNode.initialState && !state.length){
                state.push(...node.networkState, incomingNode.initialState);
            }   
        }     

        //if no intiialState value exists in any node in the network we create a new state for that minority
        if(!state.length){
            state.push(incomingNode.initialState);
        }

        // add state placeholder to the incoming node
        this.bootStrapState(incomingNode,state);
   
        // identify if any nodes networkState is larger than the networks main networkState
        this.network.forEach((node)=>{
            if(node.networkState.length > this.networkState.length){ // if so, we replace the networkState with the node's networkState
                this.networkState = node.networkState;
                this.validValues.push(node.initialState);
            }
        });

        // finally add incomingNode to network of nodes
        this.network.push(incomingNode);
    }

}

// simple class node holds index, initial state and payload function
class Node{
    constructor(index){
        this.index = index;
        this.initialState = 0;  
    }
    generatePayload(){
        return Math.floor(Math.random() * 5);      
    }
}

// closure function generates new index for new node test control
function generateIndex() {
    let index = 0;
    function incrementIndex() {
      return index++
    }
    return incrementIndex;
}
 
const nextIndex = generateIndex();

// create seed nodes array
const seedNodes = [new Node(nextIndex(),new Node(nextIndex()),new Node(nextIndex())) ];

// create network of nodes
const networkA = new Network(seedNodes);

// generated a new test control node
function newNode(){
    const generatedNode = new Node(nextIndex());
    return generatedNode;
}

networkA.tx(newNode());
networkA.tx(newNode());
networkA.tx(newNode());
networkA.tx(newNode());
networkA.tx(newNode());
networkA.tx(newNode());


/* my comments

This was a very fun exercise and i took about 2 hours and a half, mostly thinking of what I wanted to do. Thank you guys very much for your time so far and again
I've had the pleasure of getting to know more about blockchain theory, tehcnologies and strategies. 
In this approach I decided to have the incoming nodes act as the proposer of an integer. I decided to have seed nodes begin the chain and then have the incoming nodes
manipulate the majority consensus based on how many times a repeated value appeared as a payload. 

I'm pretty sure this approach is way off but I had a lot of fun thinking about this and creating a system where the network could change it's trajectory based off of incoming 
payloads. I wanted to at some point implement the bizantine concept, my naive approach is having validation routine that would verify valid integers off of a set range and then 
check that the main networkState would not change to an incorrect integer out of range and somehow manage this for it to be correct 2/3 of the time. 
 Thanks again.
*/