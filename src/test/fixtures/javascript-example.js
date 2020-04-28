class MyThing {
  doSomething(aValue) {
    if (aValue) {
      console.log(`Doing something with ${aValue}!`);
    }
  }

  doSomethingElse() {
    throw new Error('Nope!');
  }
}
