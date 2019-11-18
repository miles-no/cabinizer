using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Cabinizer.Data;
using Cabinizer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cabinizer.Controllers
{
    [Route("orgunits")]
    public class OrganizationUnitController : ApiController
    {
        static OrganizationUnitController()
        {
            MapToModel = orgUnit => new OrganizationUnitModel
            {
                Path = orgUnit.Path,
                Name = orgUnit.Name,
                ParentPath = orgUnit.ParentPath,
            };
        }

        public OrganizationUnitController(CabinizerContext context)
        {
            Context = context;
        }

        private static Expression<Func<OrganizationUnit, OrganizationUnitModel>> MapToModel { get; }

        private CabinizerContext Context { get; }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<OrganizationUnit>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<OrganizationUnit>>> GetAllOrgUnits(CancellationToken cancellationToken)
        {
            return Ok(await Context.OrganizationUnits
                .Select(MapToModel)
                .ToListAsync(cancellationToken));
        }
    }
}
