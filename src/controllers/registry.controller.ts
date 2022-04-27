import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody
} from '@loopback/rest';
import {Registry} from '../models';
import {RegistryRepository} from '../repositories';

export class RegistryController {
  constructor(
    @repository(RegistryRepository)
    public registryRepository: RegistryRepository,
  ) { }

  @post('/registries', {
    security: [{openidConnect: []}],
    responses: {
      '200': {
        description: 'Registry model instance',
        content: {'application/json': {schema: getModelSchemaRef(Registry)}},
      }
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Registry, {
            title: 'NewRegistry',
            exclude: [
              'id',
              'dateOfReception',
              'merkleRoot',
              'merkleProof',
              'readyForRegistration',
            ],
          }),
        },
      },
    })
    registry: Omit<Registry, 'id'>,
  ): Promise<Registry> {
    return this.registryRepository.create(registry);
  }

  @get('/registries/count', {
    security: [{openidConnect: []}],
    responses: {
      '200': {
        description: 'Registry model count',
        content: {'application/json': {schema: CountSchema}},
      }
    },
  })
  async count(@param.where(Registry) where?: Where<Registry>): Promise<Count> {
    return this.registryRepository.count(where);
  }

  @get('/registries', {
    security: [{openidConnect: []}],
    responses: {
      '200': {
        description: 'Array of Registry model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Registry, {includeRelations: true}),
            },
          },
        },
      }
    },
  })
  async find(
    @param.filter(Registry) filter?: Filter<Registry>,
  ): Promise<Registry[]> {
    return this.registryRepository.find(filter);
  }

  @patch('/registries', {
    security: [{openidConnect: []}],
    responses: {
      '200': {
        description: 'Registry PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      }
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Registry, {partial: true}),
        },
      },
    })
    registry: Registry,
    @param.where(Registry) where?: Where<Registry>,
  ): Promise<Count> {
    return this.registryRepository.updateAll(registry, where);
  }

  @get('/registries/{id}', {
    security: [{openidConnect: []}],
    responses: {
      '200': {
        description: 'Registry model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Registry, {includeRelations: true}),
          },
        },
      }
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Registry, {exclude: 'where'})
    filter?: FilterExcludingWhere<Registry>,
  ): Promise<Registry> {
    return this.registryRepository.findById(id, filter);
  }

  @patch('/registries/{id}', {
    security: [{openidConnect: []}],
    responses: {
      '204': {
        description: 'Registry PATCH success',
      }
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Registry, {partial: true}),
        },
      },
    })
    registry: Registry,
  ): Promise<void> {
    await this.registryRepository.updateById(id, registry);
  }

  @put('/registries/{id}', {
    security: [{openidConnect: []}],
    responses: {
      '204': {
        description: 'Registry PUT success',
      }
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() registry: Registry,
  ): Promise<void> {
    await this.registryRepository.replaceById(id, registry);
  }

  @del('/registries/{id}', {
    security: [{openidConnect: []}],
    responses: {
      '204': {
        description: 'Registry DELETE success',
      }
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.registryRepository.deleteById(id);
  }
}
