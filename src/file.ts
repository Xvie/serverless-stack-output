import * as fs from 'fs';

export default class StackOutputFile {
  constructor(public path: string | string[]) {}

  public format(data: object, path: string) {
    const ext = path.split('.').pop() || '';

    switch (ext.toUpperCase()) {
      case 'JSON':
        return JSON.stringify(data, null, 2);
      case 'TOML':
        return require('tomlify-j0.4')(data, null, 0);
      case 'YAML':
      case 'YML':
        return require('yamljs').stringify(data);
      default:
        throw new Error('No formatter found for `' + ext + '` extension');
    }
  }

  private save(data: object, path: string) {
    const content = this.format(data, path);
    try {
      fs.writeFileSync(path, content);
    } catch (e) {
      throw new Error('Cannot write to file: ' + this.path);
    }

    return Promise.resolve();
  }

  public prepareData(data: object) {
    if (Array.isArray(this.path)) {
      return Promise.all(this.path.map(path => this.save(data, path)));
    } else {
      return this.save(data, this.path);
    }
  }
}
