class Observable
{
    addObserver = () => {
        return true
    }

    updateState = () => {
        return true
    }
}

export default class StateObservable extends Observable
{
    /**
     * @var array Character
     */
    observer = [];

    addObserver = (observer) => {
        this.observer.push(observer);
    }

    updateState = (state) => {
        this.observer.forEach(element => {
            element.setState(state);
        });
    }
}