import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

morgan.token("req-body", (req) => JSON.stringify(req.body));

app.use(cors());
app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

const PORT = 3001;

let phoneBook = [
  {
    id: 1,
    name: "Mark David Panganiban",
    number: "09153465182",
  },
];

// function unknownEndPoint(request, response) {
//   response.status(404).send({ error: "unknown endpoint" });
// }

// function requestLogger(request, response, next) {
//   if (request.method === "GET") {
//     console.log(`Method: ${request.method}`);
//     console.log(`Path: ${request.path}`);
//     console.log(`Response status code: ${response.statusCode}`);
//   } else if (request.method === "POST") {
//     console.log(`Method: ${request.method}`);
//     console.log(`Path: ${request.path}`);
//     console.log(`Response status code: ${response.statusCode}`);
//     console.log("Body:", request.body);
//   }
//   next();
// }

app.get("/", (request, response) => {
  response.send("<h1>Phone Book Server Sample!</h1>");
});

app.get("/api/phonebook/", (request, response) => {
  response.json(phoneBook);
});

app.get("/api/phonebook/:id", (request, response) => {
  const id = request.params.id;
  const contact = phoneBook.find((contact) => contact.id === id);
  if (contact) {
    response.status(200).json(contact);
  } else {
    response.status(404).json({ error: `contact with id: ${id} not found!` });
  }
});

app.post("/api/phonebook/", (request, response) => {
  if (!request.body.name || !request.body.number) {
    response.status(404).json({ error: "missing element" });
  }

  const newContact = {
    id: phoneBook.length + 1,
    name: request.body.name,
    number: request.body.number,
  };

  phoneBook = phoneBook.concat(newContact);
  response.status(201).json(newContact);
});

app.put("/api/phonebook/:id", (request, response) => {
  const id = Number(request.params.id);
  const updateContact = request.body;

  if (!updateContact.name || !updateContact.number) {
    response.status(400).json({ error: "missing parameters." });
  } else {
    const index = phoneBook.findIndex((contact) => contact.id === id);
    if (updateContact && index != -1) {
      phoneBook[index].name = updateContact.name;
      phoneBook[index].number = updateContact.number;
      response.status(200).json(phoneBook[index]);
    } else {
      response.status(404).json({ error: "Contact not found." });
    }
  }
});

app.delete("/api/phonebook/:id", (request, response) => {
  const id = Number(request.params.id);
  const index = phoneBook.findIndex((contact) => contact.id === id);
  if (index != -1) {
    phoneBook.splice(index, 1);

    phoneBook.forEach((contact, i) => {
      contact.id = i + 1;
    });

    response.status(204).send();
  } else {
    response.status(404).json({ error: "Contact not found" });
  }
});

// app.use(unknownEndPoint);

app.listen(PORT, () => {
  console.log("Server is now running on port: " + PORT);
});
