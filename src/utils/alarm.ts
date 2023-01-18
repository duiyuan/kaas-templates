export default class Alarms {
  name: string

  constructor(name: string) {
    this.name = name
  }

  protected create = async (alarmInfo?: chrome.alarms.AlarmCreateInfo) => {
    const exist = await this.get(this.name)
    if (exist) {
      console.warn(
        'the alarm(name: %s) has exsited, the create will do nothing',
        this.name
      )
      return false
    }
    console.log('timer(%s) has been create, alarmInfo %o', this.name, alarmInfo)
    return chrome.alarms.create(this.name, alarmInfo || {})
  }

  protected clean = async () => {
    console.log('before clean timer(name: %s)', this.name)
    await chrome.alarms.clear(this.name)
    const remain = await this.getAll()
    console.log(
      'after clean timer(name: %s), the rest of timer: %o',
      this.name,
      remain
    )
  }

  get = (name: string) => {
    return chrome.alarms.get(name)
  }

  getAll = () => chrome.alarms.getAll()
}
