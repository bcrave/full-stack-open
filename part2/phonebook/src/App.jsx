import { useState, useEffect } from "react";
import peopleService from "./services/people";

import "./index.css";

import Filter from "./components/Filter";
import Form from "./components/Form";
import People from "./components/People";
import Notification from "./components/Notification";

export default function App() {
  const [people, setPeople] = useState(null);
  const [peopleToShow, setPeopleToShow] = useState(null);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    peopleService.getAll().then((initialPeople) => {
      setPeople(initialPeople);
    });
  }, []);

  useEffect(() => {
    setPeopleToShow((prev) => {
      if (filterTerm === "") return people;
      return prev.filter((person) => person.name.includes(filterTerm));
    });

    setPeopleToShow(
      filterTerm !== ""
        ? people.filter((person) =>
            person.name.toLowerCase().includes(filterTerm.toLowerCase())
          )
        : people
    );
  }, [people, filterTerm]);

  const handleFilterChange = (e) => {
    const { value } = e.target;
    setFilterTerm(value);
  };

  const handleNameChange = (e) => {
    const { value } = e.target;
    setName(value);
  };

  const handleNumberChange = (e) => {
    const { value } = e.target;
    setNumber(value);
  };

  const handleDelete = (id, name) => {
    confirm(`Delete ${name}?`);

    peopleService.remove(id).then(() => {
      const peopleMinusDeleted = people.filter((person) => person.id !== id);
      setPeople(peopleMinusDeleted);
      setNotification({
        message: `'${name}' successfully deleted!`,
        type: "success",
      });
      setTimeout(() => {
        setNotification(null);
      }, 2000);
    });
  };

  const createPerson = (newPerson) => {
    peopleService.create(newPerson).then((newPerson) => {
      setPeople((prev) => [...prev, newPerson]);
      setNotification({
        message: `'${newPerson.name}' successfully added!`,
        type: "success",
      });
      setTimeout(() => {
        setNotification(null);
      }, 2000);
    });
  };

  const updatePerson = (newPerson) => {
    confirm(
      `${name} is already in the phonebook. Replace the old number with a new one?`
    );
    peopleService
      .getOne(name)
      .then(([personToUpdate]) => {
        peopleService
          .update(personToUpdate.id, newPerson)
          .then((updatedPerson) => {
            setPeople((prev) =>
              prev.map((person) =>
                person.id !== updatedPerson.id ? person : updatedPerson
              )
            );
          });
      })
      .catch((err) => {
        setNotification({
          message: `'${name}' was already removed from server.`,
          type: "error",
        });
        console.error(err);
        const peopleMinusDeleted = people.filter(
          (person) => person.name !== name
        );
        setPeople(peopleMinusDeleted);
        setTimeout(() => {
          setNotification(null);
        }, 2000);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      people.some(
        (person) =>
          person.name.toLowerCase() === name.toLowerCase() &&
          person.number === number
      )
    ) {
      alert(`${name} is already in the phonebook`);
      setName("");
      setNumber("");
      return;
    }

    const newPerson = {
      name,
      number,
    };

    if (
      people.some((person) => person.name.toLowerCase() === name.toLowerCase())
    ) {
      updatePerson(newPerson);
    } else {
      createPerson(newPerson);
    }
    setName("");
    setNumber("");
  };

  return (
    <div>
      <h1>Phonebook</h1>

      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <Filter handleFilterChange={handleFilterChange} value={filterTerm} />

      <Form
        handleSubmit={handleSubmit}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        name={name}
        number={number}
      />

      <h2>Numbers</h2>
      {peopleToShow && (
        <People peopleToShow={peopleToShow} handleDelete={handleDelete} />
      )}
    </div>
  );
}
