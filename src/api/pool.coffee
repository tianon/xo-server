{$wait} = require '../fibers-utils'

#=====================================================================

exports.set = ->
  params = @getParams {
    id: { type: 'string' }

    name_label: { type: 'string', optional: true }

    name_description: { type: 'string', optional: true }
  }

  # Current user must be an administrator.
  @checkPermission 'admin'

  try
    pool = @getObject params.id
  catch
    @throw 'NO_SUCH_OBJECT'

  xapi = @getXAPI pool

  for param, field of {
    'name_label'
    'name_description'
  }
    continue unless param of params

    $wait xapi.call "pool.set_#{field}", pool.ref, params[param]

  return
