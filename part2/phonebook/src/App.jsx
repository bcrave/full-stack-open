/* eslint-disable no-debugger */
import { useState, useEffect, useRef } from "react";
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
  const inputRef = useRef();

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

    peopleService
      .remove(id)
      .then(() => {
        const peopleMinusDeleted = people.filter((person) => person.id !== id);
        setPeople(peopleMinusDeleted);

        setNotification({
          message: `'${name}' successfully deleted!`,
          type: "success",
        });
        setTimeout(() => {
          setNotification(null);
        }, 2000);
      })
      .catch((err) => {
        const peopleMinusDeleted = people.filter((person) => person.id !== id);
        setPeople(peopleMinusDeleted);

        setNotification({
          message: err.response.data.error,
          type: "error",
        });

        setTimeout(() => {
          setNotification(null);
        }, 2000);
      });
  };

  const createPerson = (newPerson) => {
    peopleService
      .create(newPerson)
      .then((newPerson) => {
        setPeople((prev) => [...prev, newPerson]);

        setName("");
        setNumber("");
        inputRef.current.focus();

        setNotification({
          message: `'${newPerson.name}' successfully added!`,
          type: "success",
        });
        setTimeout(() => {
          setNotification(null);
        }, 2000);
      })
      .catch((err) => {
        setName("");
        setNumber("");
        inputRef.current.focus();

        setNotification({
          message: `${err.response.data.error}. Refreshing page...`,
          type: "error",
        });

        setTimeout(() => {
          window.location.reload(false);
        }, 2000);
      });
  };

  const updatePerson = (newPerson) => {
    const { name } = newPerson;
    const [{ id }] = people.filter((person) => person.name === name);

    peopleService
      .update(id, newPerson)
      .then((updatedPerson) => {
        setPeople((prev) =>
          prev.map((person) =>
            person.id !== updatedPerson.id ? person : updatedPerson
          )
        );
        setNotification({
          message: `Successfully updated ${newPerson.name}`,
          type: "success",
        });
        setTimeout(() => {
          setNotification(null);
        }, 2000);

        setName("");
        setNumber("");

        inputRef.current.focus();
      })
      .catch((err) => {
        setNotification({
          message: err.response.data.error,
          type: "error",
        });
        console.error(err);
        const peopleMinusDeleted = people.filter(
          (person) => person.name !== name
        );
        setPeople(peopleMinusDeleted);

        setName("");
        setNumber("");

        setTimeout(() => {
          setNotification(null);
        }, 2000);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPerson = {
      name,
      number,
    };
    const [personFromDB] = people.filter((person) => person.name === name);

    if (personFromDB && newPerson.number !== personFromDB.number) {
      confirm(
        `${name} is already in the phonebook. Replace the old number with a new one?`
      );
      updatePerson(newPerson);
    } else {
      createPerson(newPerson);
      setName("");
      setNumber("");
      return;
    }
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
        inputRef={inputRef}
      />

      <h2>Numbers</h2>
      {peopleToShow && (
        <People peopleToShow={peopleToShow} handleDelete={handleDelete} />
      )}
    </div>
  );
}
