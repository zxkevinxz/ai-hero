The topic of what a large language model is has been discussed to death. There are a tonne of really great resources out there.

I'm going to take some of those resources and provide a summary for you.

## What Is a Large Language Model?

A large language model is essentially two files. One file contains the parameters of the model, which is the raw output of the model's pre-training. We'll talk about what parameters are in a second. This file could be hundreds and hundreds of gigabytes depending on the size of the model.

The other file is simply a file to run the model. This allows you to send text to the model and get a response back. This process is called 'inference'.

## How Do You Train A Model?

In order to get the parameters, you need to train the model. Training large language models is an extremely involved process that requires a lot of time, expertise, and money.

A rough guide is to take a chunk of the internet, let's say 10TB of data. You use 6,000 GPU's for 12 days, at the cost of around $2M. And you end up with a ~140GB file with all the parameters of the model.

Andre Kapasi describes the resulting file as a 'compression' of its input data. This mental model is useful

## What Is A Parameter?

- Each parameter is two bytes. It's a Float16 number.
