import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { UsuarioFinal } from 'src/interfaces/usuario.interface';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getFromCache(key: string) {
    const value = await this.cacheManager.get(key);
    return value;
  }

  async setToCache(key: string, value: UsuarioFinal) {
    // con el 3 parametro colocamos un tiempo de expiracion de la memoria cache, si se pasa en 0 la memoria cache no caduca
    await this.cacheManager.set(key, value, 0);

    return true;
  }

  async deleteFromCache(key: string) {
    await this.cacheManager.del(key);

    return true;
  }

  async deleteAllInCache() {
    await this.cacheManager.clear();

    return true;
  }
}
